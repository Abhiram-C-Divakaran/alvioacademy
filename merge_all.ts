import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { codingProblems as currentProblems } from './src/data/codingProblems';
import { part4 } from './data_part4';
import { part5 } from './data_part5';

const allNewRaw = [...part4, ...part5];

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
    javascript: `function ${sigObj.name}(${paramNames}) {\\n  \\n}`,
    python: `def ${sigObj.name}(${paramNames}):\\n    pass`,
    cpp: `class Solution {\\npublic:\\n    ${cppRet} ${sigObj.name}(${cppParams}) {\\n        \\n    }\\n};`,
  };
}

const finalProblems = allNewRaw.map(d => {
  const sigObj = parseSig(d[4] as string);
  return {
    id: d[0],
    title: d[1],
    difficulty: d[2],
    topic: d[3],
    signature: sigObj,
    description: d[5],
    examples: (d[6] as any[]).map((t, i) => ({
      input: sigObj.params.map((p, pi) => `${p.name} = ${JSON.stringify(t[0][pi])}`).join(', '),
      output: JSON.stringify(t[1])
    })),
    constraints: ["Check problem description for constraints."],
    starterCode: generateStarterCode(sigObj),
    testCases: (d[6] as any[]).map(t => ({ input: t[0], expected: t[1] }))
  };
});

let fileOutput = `// Auto-generated 300 problems
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type DataType = 'integer' | 'string' | 'boolean' | 'integer[]' | 'string[]' | 'integer[][]' | 'char[]';

export interface ProblemSignature {
  name: string;
  params: { name: string; type: DataType }[];
  returns: DataType;
}

export interface TestCase {
  input: any[];
  expected: any;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic?: string;
  signature: ProblemSignature;
  description: string;
  examples: { input: string; output: string }[];
  constraints: string[];
  starterCode: { javascript: string; python: string; cpp: string };
  testCases: TestCase[];
}

export const codingProblems: CodingProblem[] = [
`;

const allProblemsToExport = [...currentProblems, ...finalProblems];

for (const p of allProblemsToExport) {
  fileOutput += `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    difficulty: ${JSON.stringify(p.difficulty)},
    topic: ${JSON.stringify(p.topic)},
    signature: ${JSON.stringify(p.signature)},
    description: ${JSON.stringify(p.description)},
    examples: ${JSON.stringify(p.examples)},
    constraints: ${JSON.stringify(p.constraints)},
    starterCode: ${JSON.stringify(p.starterCode)},
    testCases: ${JSON.stringify(p.testCases)}
  },
`;
}

fileOutput += '];\n';

fs.writeFileSync(path.join(process.cwd(), 'src/data/codingProblems.ts'), fileOutput);
console.log('Successfully regenerated exactly ' + allProblemsToExport.length + ' problems!');
