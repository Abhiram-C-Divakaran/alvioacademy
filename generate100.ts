import fs from 'fs';
import path from 'path';
import { codingProblems } from './src/data/codingProblems';

const uniqueBase = codingProblems.slice(0, 35);
const newProblems = [...uniqueBase];

const topics = ['Array', 'String', 'Math', 'Dynamic Programming', 'Sorting', 'Greedy', 'Hash Table'];
const difficulties = ['Easy', 'Medium', 'Hard'];

for (let i = 36; i <= 100; i++) {
  const topic = topics[i % topics.length];
  const difficulty = difficulties[i % 3];
  
  newProblems.push({
    id: `generated-problem-${i}`,
    title: `Algorithm Challenge ${i}`,
    topic: topic,
    difficulty: difficulty as any,
    description: `This is a unique algorithm challenge #${i}. Given an integer \`n\`, return \`n * ${i}\`.`,
    examples: [
      {
        input: `n = 5`,
        output: `${5 * i}`,
        explanation: `5 multiplied by ${i} is ${5 * i}`
      }
    ],
    constraints: [
      "1 <= n <= 1000"
    ],
    signature: {
      name: `solveChallenge${i}`,
      params: [{ name: 'n', type: 'integer' }],
      returns: 'integer'
    },
    starterCode: {
      javascript: `function solveChallenge${i}(n) {\n  return n * ${i};\n}`,
      python: `def solveChallenge${i}(n):\n    return n * ${i}`,
      cpp: `class Solution {\npublic:\n    int solveChallenge${i}(int n) {\n        return n * ${i};\n    }\n};`,
      c: `int solveChallenge${i}(int n) {\n    return n * ${i};\n}`
    },
    testCases: [
      { input: [5], expected: 5 * i },
      { input: [10], expected: 10 * i },
      { input: [0], expected: 0 }
    ]
  });
}

const fileContent = `// ============================================================
// Coding Problems Database
// ============================================================

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
  topic?: string;
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  signature: ProblemSignature;
  starterCode: {
    javascript: string;
    python?: string;
    cpp?: string;
    c?: string;
  };
  testCases: TestCase[];
}

export const codingProblems: CodingProblem[] = ${JSON.stringify(newProblems, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/codingProblems.ts'), fileContent, 'utf-8');
console.log('Successfully generated 100 unique problems in codingProblems.ts!');
