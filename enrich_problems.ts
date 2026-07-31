import fs from 'fs';
import path from 'path';
import { codingProblems } from './src/data/codingProblems';
import { DatabaseSync } from 'node:sqlite';

function generateConstraints(p: any) {
  const c = [];
  const sig = p.signature;
  const isHard = p.difficulty === 'Hard';
  const isMed = p.difficulty === 'Medium';
  const maxN = isHard ? '10^5' : (isMed ? '10^4' : '10^3');
  
  if (sig && sig.params) {
    for (const param of sig.params) {
      if (param.type === 'integer[]' || param.type === 'string[]') {
        c.push(`1 <= ${param.name}.length <= ${maxN}`);
        if (param.type === 'integer[]') {
          c.push(`-10^4 <= ${param.name}[i] <= 10^4`);
        } else {
          c.push(`${param.name}[i].length <= 100`);
        }
      } else if (param.type === 'string') {
        c.push(`1 <= ${param.name}.length <= ${maxN}`);
        c.push(`${param.name} consists of printable ASCII characters.`);
      } else if (param.type === 'integer') {
        c.push(`-10^9 <= ${param.name} <= 10^9`);
      } else if (param.type === 'integer[][]' || param.type === 'string[][]') {
        c.push(`1 <= ${param.name}.length, ${param.name}[i].length <= 200`);
      }
    }
  }
  
  // Specific overrides
  if (p.title.includes("Digit One")) {
    return [
      "0 <= n <= 10^9"
    ];
  }
  if (p.title.includes("Sudoku")) {
    return [
      "board.length == 9",
      "board[i].length == 9",
      "board[i][j] is a digit 1-9 or '.'."
    ];
  }
  if (p.topic.includes("Tree") || p.topic.includes("Linked List")) {
    c.push(`The number of nodes in the list/tree is in the range [0, ${maxN}].`);
    c.push(`-100 <= Node.val <= 100`);
  }
  
  // Clean up
  const uniqueC = Array.from(new Set(c));
  if (uniqueC.length === 0) return ["No specific constraints."];
  return uniqueC;
}

// Manually compute some extra examples for specific problems
function getExtraExamples(p: any) {
  if (p.id === 'number-of-digit-one') {
    return [
      { input: 'n = 0', output: '0' },
      { input: 'n = 13', output: '6' },
      { input: 'n = 20', output: '12' },
      { input: 'n = 100', output: '21' }
    ];
  }
  if (p.id === 'two-sum' || p.title === 'Two Sum') {
    return [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ];
  }
  if (p.title === 'Longest Substring Without Repeating Characters') {
    return [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
      { input: 's = "pwwkew"', output: '3' }
    ];
  }
  // Try to generate a 3rd dummy example if we only have 1 or 2 and it's easy to guess
  return null;
}

for (const p of codingProblems) {
  p.constraints = generateConstraints(p);
  const extra = getExtraExamples(p);
  if (extra) {
    p.examples = extra;
    // We should also update testCases to match examples so they don't break
    // Since examples are strings, let's roughly parse them or just leave testcases as is.
    // Actually testcases for Number of digit one:
    if (p.id === 'number-of-digit-one') {
      p.testCases = [
        { input: [0], expected: 0 },
        { input: [13], expected: 6 },
        { input: [20], expected: 12 },
        { input: [100], expected: 21 }
      ];
    }
  } else {
    // If it only has 1 example, let's duplicate it with a minor change? No, better leave it, but at least the constraints are huge now.
  }
}

let fileOutput = `// Auto-generated 400 problems with enriched constraints
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

for (const p of codingProblems) {
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
console.log('Successfully enriched constraints for all problems!');

// No db here
