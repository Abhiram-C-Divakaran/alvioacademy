import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { codingProblems as currentProblems } from './src/data/codingProblems';
import { DatabaseSync } from 'node:sqlite';

// Deduplicate
const uniqueProblems = new Map();
for (const p of currentProblems) {
  if (!uniqueProblems.has(p.title)) {
    uniqueProblems.set(p.title, p);
  }
}

let problems = Array.from(uniqueProblems.values());

// Add more questions to reach 400
const extraQuestionsRaw = [
  ["koko-eating-bananas","Koko Eating Bananas","Medium","Array, Binary Search","minEatingSpeed(piles: integer[], h: integer) => integer","Koko loves to eat bananas. There are n piles of bananas. Return the minimum integer k such that she can eat all the bananas within h hours.",[[[ [3,6,7,11],8 ],4]]],
  ["search-a-2d-matrix-ii","Search a 2D Matrix II","Medium","Array, Binary Search, Divide and Conquer, Matrix","searchMatrix(matrix: integer[][], target: integer) => boolean","Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix.",[[[ [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22]],5 ],true]]],
  ["daily-temperatures","Daily Temperatures","Medium","Array, Stack, Monotonic Stack","dailyTemperatures(temperatures: integer[]) => integer[]","Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",[[[ [73,74,75,71,69,72,76,73] ],[1,1,4,2,1,1,0,0]]]],
  ["car-fleet","Car Fleet","Medium","Array, Stack, Sorting, Monotonic Stack","carFleet(target: integer, position: integer[], speed: integer[]) => integer","There are n cars going to the same destination along a one-lane road. Return the number of car fleets that will arrive at the destination.",[[[ 12,[10,8,0,5,3],[2,4,1,1,3] ],3]]],
  ["generate-parentheses","Generate Parentheses","Medium","String, Dynamic Programming, Backtracking","generateParenthesis(n: integer) => string[]","Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",[[[ 3 ],["((()))","(()())","(())()","()(())","()()()"]]]],
  ["evaluate-reverse-polish-notation","Evaluate Reverse Polish Notation","Medium","Array, Math, Stack","evalRPN(tokens: string[]) => integer","You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression. Return an integer that represents the value of the expression.",[[[ ["2","1","+","3","*"] ],9]]],
  ["min-stack","Min Stack","Medium","Stack, Design","minStack(operations: string[], args: integer[][]) => integer[]","Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",[[[ ["MinStack","push","push","push","getMin","pop","top","getMin"],[[],[-2],[0],[-3],[],[],[],[]] ],[null,null,null,null,-3,null,0,-2]]]],
  ["valid-sudoku","Valid Sudoku","Medium","Array, Hash Table, Matrix","isValidSudoku(board: string[][]) => boolean","Determine if a 9 x 9 Sudoku board is valid.",[[[ [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]] ],true]]],
  ["group-anagrams","Group Anagrams","Medium","Array, Hash Table, String, Sorting","groupAnagrams(strs: string[]) => string[][]","Given an array of strings strs, group the anagrams together. You can return the answer in any order.",[[[ ["eat","tea","tan","ate","nat","bat"] ],[["bat"],["nat","tan"],["ate","eat","tea"]]]]],
  ["top-k-frequent-elements","Top K Frequent Elements","Medium","Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue), Bucket Sort, Counting, Quickselect","topKFrequent(nums: integer[], k: integer) => integer[]","Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",[[[ [1,1,1,2,2,3],2 ],[1,2]]]]
];

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

let extraNeeded = 400 - problems.length;
for (let i = 0; i < extraNeeded && i < extraQuestionsRaw.length; i++) {
  const d = extraQuestionsRaw[i];
  const sigObj = parseSig(d[4] as string);
  problems.push({
    id: crypto.randomUUID(),
    title: d[1] as string,
    difficulty: d[2] as any,
    topic: d[3] as string,
    signature: sigObj,
    description: d[5] as string,
    examples: (d[6] as any[]).map((t, i) => ({
      input: sigObj.params.map((p: any, pi: number) => `${p.name} = ${JSON.stringify(t[0][pi])}`).join(', '),
      output: JSON.stringify(t[1])
    })),
    constraints: ["Check problem description for constraints."],
    starterCode: generateStarterCode(sigObj),
    testCases: (d[6] as any[]).map(t => ({ input: t[0], expected: t[1] }))
  });
}

// Shuffle
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(problems);

let fileOutput = `// Auto-generated 400 problems
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

export const codingProblems: CodingProblem[] = [\n`;

for (const p of problems) {
  fileOutput += `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    difficulty: ${JSON.stringify(p.difficulty)},
    topic: ${JSON.stringify(p.topic || "")},
    signature: ${JSON.stringify(p.signature)},
    description: ${JSON.stringify(p.description)},
    examples: ${JSON.stringify(p.examples)},
    constraints: ${JSON.stringify(p.constraints)},
    starterCode: ${JSON.stringify(p.starterCode)},
    testCases: ${JSON.stringify(p.testCases)}
  },\n`;
}
fileOutput += '];\n';

fs.writeFileSync(path.join(process.cwd(), 'src/data/codingProblems.ts'), fileOutput);
console.log('Successfully wrote exact ' + problems.length + ' shuffled problems!');

// Migrate DB
const db = new DatabaseSync(path.join(process.cwd(), 'data', 'database.sqlite'));

db.exec('PRAGMA foreign_keys = OFF;');

// Get valid IDs
const validIds = problems.map(p => p.id);
const allDbProblems = db.prepare('SELECT id FROM problems').all() as any[];

let deleted = 0;
for (const row of allDbProblems) {
  if (!validIds.includes(row.id)) {
    db.prepare('DELETE FROM user_problem_interactions WHERE problem_id = ?').run(row.id);
    db.prepare('DELETE FROM problem_feedback WHERE problem_id = ?').run(row.id);
    db.prepare('DELETE FROM user_submissions WHERE problem_id = ?').run(row.id);
    db.prepare('DELETE FROM problem_stats WHERE problem_id = ?').run(row.id);
    db.prepare('DELETE FROM problems WHERE id = ?').run(row.id);
    deleted++;
  }
}
console.log(`Deleted ${deleted} old/duplicate problems from DB.`);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO problems (
    id, title, topic, difficulty, description, examples, constraints, signature, starterCode, testCases
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const p of problems) {
  insertStmt.run(
    p.id,
    p.title,
    p.topic || '',
    p.difficulty,
    p.description,
    JSON.stringify(p.examples),
    JSON.stringify(p.constraints),
    JSON.stringify(p.signature),
    JSON.stringify(p.starterCode),
    JSON.stringify(p.testCases)
  );
  inserted++;
}
db.exec('PRAGMA foreign_keys = ON;');
console.log(`Inserted/Updated ${inserted} problems into DB.`);
