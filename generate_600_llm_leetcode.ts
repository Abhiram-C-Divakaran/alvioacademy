import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import https from 'https';

const GROQ_API_KEY = process.env.GROQ_API_KEY; // Removed hardcoded key for security

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'database.sqlite');
const db = new DatabaseSync(dbPath);

const insertStmt = db.prepare(`
  INSERT INTO problems (id, title, topic, difficulty, description, examples, constraints, signature, starterCode, testCases)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function parseSig(sig: string) {
  const parts = sig.split('=>');
  const returns = parts[1].trim();
  const left = parts[0].trim();
  const name = left.substring(0, left.indexOf('('));
  const paramsStr = left.substring(left.indexOf('(')+1, left.length-1);
  const params = paramsStr.split(',').map(s => {
    const [pn, pt] = s.split(':');
    return { name: pn.trim(), type: pt.trim() };
  });
  return { name, params, returns };
}

function generateStarterCode(sigObj: any) {
  const paramNames = sigObj.params.map((p: any) => p.name).join(', ');
  let cppParams = sigObj.params.map((p: any) => {
    let t = "int";
    if (p.type === 'integer[]') t = "vector<int>&";
    if (p.type === 'string') t = "string";
    if (p.type === 'string[]') t = "vector<string>&";
    if (p.type === 'integer[][]') t = "vector<vector<int>>&";
    if (p.type === 'string[][]') t = "vector<vector<string>>&";
    return `${t} ${p.name}`;
  }).join(', ');
  
  let cppRet = "int";
  if (sigObj.returns === 'boolean') cppRet = "bool";
  if (sigObj.returns === 'integer[]') cppRet = "vector<int>";
  if (sigObj.returns === 'string') cppRet = "string";
  if (sigObj.returns === 'string[]') cppRet = "vector<string>";
  if (sigObj.returns === 'integer[][]') cppRet = "vector<vector<int>>";
  if (sigObj.returns === 'string[][]') cppRet = "vector<vector<string>>";
  
  return {
    javascript: `function ${sigObj.name}(${paramNames}) {\n  \n}`,
    python: `def ${sigObj.name}(${paramNames}):\n    pass`,
    cpp: `class Solution {\npublic:\n    ${cppRet} ${sigObj.name}(${cppParams}) {\n        \n    }\n};`,
  };
}

async function callGroq(prompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
             resolve(JSON.parse(parsed.choices[0].message.content));
          } else {
             reject(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log("Starting to fetch 600 unique LeetCode problems via Groq API...");
  let count = 0;
  let batch = 1;

  // Since LLMs might repeat, we keep track of added IDs
  const existingIds = new Set<string>();

  while (count < 600) {
    console.log(`\nFetching batch ${batch}... (Current count: ${count}/600)`);
    
    const prompt = `
      You are an expert algorithm platform database generator.
      Your task is to provide exactly 10 REAL, authentic LeetCode problems that are highly distinct.
      DO NOT provide Two Sum or problems I might have already generated.
      Generate 10 completely unique questions from LeetCode. 
      Specifically, focus on problems with Leetcode difficulty ID around ${batch * 10} to ${batch * 10 + 10} to ensure no duplicates across batches.

      Output a JSON object with a single key "problems" containing an array of 10 elements.
      Each element MUST be an array exactly like this:
      ["id-string", "Problem Title", "Difficulty", "Topic1, Topic2", "functionName(param1: type, param2: type) => returnType", "Problem description...", [ [[input1_arg1, input1_arg2], output1], [[input2_arg1, input2_arg2], output2] ]]

      Supported types for signature: integer, string, boolean, integer[], string[], integer[][], string[][].
      Example signature: "findMedian(nums1: integer[], nums2: integer[]) => integer"
      Example array element:
      ["container-with-most-water", "Container With Most Water", "Medium", "Array, Two Pointers", "maxArea(height: integer[]) => integer", "You are given an integer array height...", [ [[ [1,8,6,2,5,4,8,3,7] ], 49], [[ [1,1] ], 1] ]]

      Make sure to return exactly 10 valid problems in valid JSON format. 
      Ensure the test case inputs are properly nested in arrays.
      Ensure the signature precisely follows the format.
    `;

    try {
      const response = await callGroq(prompt);
      const problems = response.problems || [];
      
      let addedInBatch = 0;
      for (const d of problems) {
        if (existingIds.has(d[0])) continue;
        existingIds.add(d[0]);
        
        try {
          const sigObj = parseSig(d[4]);
          const pExamples = JSON.stringify(d[6].map((t: any, i: number) => ({
            input: sigObj.params.map((p: any, pi: number) => `${p.name} = ${JSON.stringify(t[0][pi])}`).join(', '),
            output: JSON.stringify(t[1])
          })));
          
          const pConstraints = JSON.stringify(["Check problem description for constraints."]);
          const pSignature = JSON.stringify({ name: sigObj.name, params: sigObj.params, returns: sigObj.returns });
          const pStarterCode = JSON.stringify(generateStarterCode(sigObj));
          const pTestCases = JSON.stringify(d[6].map((t: any) => ({ input: t[0], expected: t[1] })));
          
          insertStmt.run(d[0], d[1], d[3], d[2], d[5], pExamples, pConstraints, pSignature, pStarterCode, pTestCases);
          count++;
          addedInBatch++;
          if (count >= 600) break;
        } catch (err) {
          console.error(`Failed to process problem ${d[0]}:`, err);
        }
      }
      console.log(`Added ${addedInBatch} problems in batch ${batch}. Total: ${count}`);
    } catch (err) {
      console.error("Error calling Groq or parsing:", err);
      // Wait a bit before retrying on error
      await new Promise(r => setTimeout(r, 5000));
    }
    
    batch++;
    // Respect rate limits, wait 3 seconds between batches
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log("Successfully imported 600 real LeetCode problems!");
}

main();
