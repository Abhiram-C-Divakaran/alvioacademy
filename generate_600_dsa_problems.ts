import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'database.sqlite');
const db = new DatabaseSync(dbPath);

const insertStmt = db.prepare(`
  INSERT INTO problems (id, title, topic, difficulty, description, examples, constraints, signature, starterCode, testCases)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Helper to generate N random integers
function randArr(len: number, min: number, max: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

let generatedCount = 0;

// Template definition
interface Template {
  logic: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  getTitle: (v: number) => string;
  getDesc: (v: number) => string;
  sig: string;
  generateTests: (v: number) => { input: any[], output: any }[];
  starterJs: string;
  starterPy: string;
  starterCpp: string;
}

const templates: Template[] = [
  {
    logic: 'two_sum_fixed',
    topic: 'Array, Hash Table',
    difficulty: 'Easy',
    getTitle: (v) => `Two Sum (Target ${v})`,
    getDesc: (v) => `Given an array of integers, return the indices of the two numbers such that they add up to a specific target value, which in this case is exactly ${v}. Assume there is exactly one solution.`,
    sig: `twoSum(nums: integer[]) -> integer[]`,
    generateTests: (v) => {
      // We'll generate an array that definitely contains a pair summing to v
      const arr = [1, 2, 3, v - 3, 5];
      return [
        { input: [arr], output: [2, 3] },
        { input: [[v-1, 1, 0, -5]], output: [0, 1] }
      ];
    },
    starterJs: `function twoSum(nums) {\n  // target is fixed in the description\n  return [];\n}`,
    starterPy: `def twoSum(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums) {\n        return {};\n    }\n};`
  },
  {
    logic: 'count_multiples',
    topic: 'Array, Math',
    difficulty: 'Easy',
    getTitle: (v) => `Count Multiples of ${v}`,
    getDesc: (v) => `Given an integer array, count how many elements are perfectly divisible by ${v}.`,
    sig: `countMultiples(nums: integer[]) -> integer`,
    generateTests: (v) => {
      const arr1 = [v, v*2, v*3+1, 0];
      const arr2 = [1, 2, 3, 4, 5, 6].map(x => x * v);
      return [
        { input: [arr1], output: 3 },
        { input: [arr2], output: 6 }
      ];
    },
    starterJs: `function countMultiples(nums) {\n  \n}`,
    starterPy: `def countMultiples(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    int countMultiples(vector<int>& nums) {\n        return 0;\n    }\n};`
  },
  {
    logic: 'find_kth_largest',
    topic: 'Array, Sorting, Heap',
    difficulty: 'Medium',
    getTitle: (v) => `Find the ${v}th Largest Element`,
    getDesc: (v) => `Given an unsorted array of integers, find the ${v}th largest element in it. Note that it is the ${v}th largest element in the sorted order, not the ${v}th distinct element.`,
    sig: `findKthLargest(nums: integer[]) -> integer`,
    generateTests: (v) => {
      // Must have at least v elements
      const arr1 = randArr(v + 5, 1, 100);
      const arr2 = randArr(v + 10, -50, 50);
      return [
        { input: [arr1], output: [...arr1].sort((a,b)=>b-a)[v-1] },
        { input: [arr2], output: [...arr2].sort((a,b)=>b-a)[v-1] }
      ];
    },
    starterJs: `function findKthLargest(nums) {\n  \n}`,
    starterPy: `def findKthLargest(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums) {\n        return 0;\n    }\n};`
  },
  {
    logic: 'max_consecutive_element',
    topic: 'Array, Two Pointers',
    difficulty: 'Easy',
    getTitle: (v) => `Max Consecutive ${v}s`,
    getDesc: (v) => `Given an integer array, return the maximum number of consecutive ${v}'s in the array.`,
    sig: `findMaxConsecutive(nums: integer[]) -> integer`,
    generateTests: (v) => {
      const arr1 = [v, v, 0, v, v, v];
      const arr2 = [1, 2, v, 4];
      return [
        { input: [arr1], output: 3 },
        { input: [arr2], output: 1 }
      ];
    },
    starterJs: `function findMaxConsecutive(nums) {\n  \n}`,
    starterPy: `def findMaxConsecutive(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    int findMaxConsecutive(vector<int>& nums) {\n        return 0;\n    }\n};`
  },
  {
    logic: 'subarray_sum_fixed',
    topic: 'Array, Prefix Sum',
    difficulty: 'Medium',
    getTitle: (v) => `Subarrays Summing to ${v}`,
    getDesc: (v) => `Given an array of integers, find the total number of continuous subarrays whose sum equals exactly ${v}.`,
    sig: `subarraySumCount(nums: integer[]) -> integer`,
    generateTests: (v) => {
      // To ensure test predictability, we calculate it dynamically
      const calculate = (arr: number[], target: number) => {
        let count = 0;
        for(let i=0; i<arr.length; i++) {
          let sum = 0;
          for(let j=i; j<arr.length; j++) {
            sum += arr[j];
            if (sum === target) count++;
          }
        }
        return count;
      };
      const arr1 = [1, 1, 1, v, 0];
      const arr2 = [v, -1, 1, v];
      return [
        { input: [arr1], output: calculate(arr1, v) },
        { input: [arr2], output: calculate(arr2, v) }
      ];
    },
    starterJs: `function subarraySumCount(nums) {\n  \n}`,
    starterPy: `def subarraySumCount(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    int subarraySumCount(vector<int>& nums) {\n        return 0;\n    }\n};`
  },
  {
    logic: 'rotate_array_k',
    topic: 'Array, Math',
    difficulty: 'Medium',
    getTitle: (v) => `Rotate Array Right by ${v}`,
    getDesc: (v) => `Given an array, rotate the array to the right by exactly ${v} steps, where ${v} is non-negative.`,
    sig: `rotateArray(nums: integer[]) -> integer[]`,
    generateTests: (v) => {
      const rot = (arr: number[], k: number) => {
        k = k % arr.length;
        if(k === 0) return arr;
        return [...arr.slice(-k), ...arr.slice(0, arr.length - k)];
      };
      const arr1 = [1, 2, 3, 4, 5, 6, 7];
      const arr2 = [-1, -100, 3, 99];
      return [
        { input: [arr1], output: rot([...arr1], v) },
        { input: [arr2], output: rot([...arr2], v) }
      ];
    },
    starterJs: `function rotateArray(nums) {\n  \n}`,
    starterPy: `def rotateArray(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    vector<int> rotateArray(vector<int>& nums) {\n        return {};\n    }\n};`
  },
  {
    logic: 'power_of_number',
    topic: 'Math',
    difficulty: 'Easy',
    getTitle: (v) => `Power of ${v}`,
    getDesc: (v) => `Given an integer n, return true if it is a power of ${v}. Otherwise, return false.`,
    sig: `isPower(n: integer) -> boolean`,
    generateTests: (v) => {
      const pow1 = Math.pow(v, 3);
      const pow2 = Math.pow(v, 4) + 1;
      return [
        { input: [pow1], output: true },
        { input: [pow2], output: false }
      ];
    },
    starterJs: `function isPower(n) {\n  \n}`,
    starterPy: `def isPower(n):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    bool isPower(int n) {\n        return false;\n    }\n};`
  },
  {
    logic: 'shift_string_ascii',
    topic: 'String, Math',
    difficulty: 'Easy',
    getTitle: (v) => `Shift Cipher by ${v}`,
    getDesc: (v) => `Given a lowercase string, shift every character forward in the alphabet by exactly ${v} positions. Wrap around if necessary.`,
    sig: `shiftString(s: string) -> string`,
    generateTests: (v) => {
      const shift = (s: string, k: number) => {
        return s.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 97 + k) % 26) + 97)).join('');
      };
      return [
        { input: ["abc"], output: shift("abc", v) },
        { input: ["xyz"], output: shift("xyz", v) }
      ];
    },
    starterJs: `function shiftString(s) {\n  \n}`,
    starterPy: `def shiftString(s):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    string shiftString(string s) {\n        return "";\n    }\n};`
  },
  {
    logic: 'find_distances_k',
    topic: 'Array, Hash Table',
    difficulty: 'Easy',
    getTitle: (v) => `Contains Duplicate within Distance ${v}`,
    getDesc: (v) => `Given an integer array nums, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= ${v}.`,
    sig: `containsNearbyDuplicate(nums: integer[]) -> boolean`,
    generateTests: (v) => {
      const calc = (arr: number[], k: number) => {
        for(let i=0; i<arr.length; i++) {
          for(let j=i+1; j<=i+k && j<arr.length; j++) {
            if(arr[i] === arr[j]) return true;
          }
        }
        return false;
      };
      const arr1 = [1,2,3,1];
      const arr2 = [1,2,3,1,2,3];
      return [
        { input: [arr1], output: calc(arr1, v) },
        { input: [arr2], output: calc(arr2, v) }
      ];
    },
    starterJs: `function containsNearbyDuplicate(nums) {\n  \n}`,
    starterPy: `def containsNearbyDuplicate(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    bool containsNearbyDuplicate(vector<int>& nums) {\n        return false;\n    }\n};`
  },
  {
    logic: 'kth_missing_positive',
    topic: 'Array, Binary Search',
    difficulty: 'Easy',
    getTitle: (v) => `Find the ${v}th Missing Positive Number`,
    getDesc: (v) => `Given an array of strictly increasing positive integers, find the ${v}th positive integer that is missing from this array.`,
    sig: `findKthPositive(nums: integer[]) -> integer`,
    generateTests: (v) => {
      const calc = (arr: number[], k: number) => {
        let missingCount = 0;
        let current = 1;
        let i = 0;
        while (missingCount < k) {
          if (i < arr.length && arr[i] === current) {
            i++;
          } else {
            missingCount++;
            if (missingCount === k) return current;
          }
          current++;
        }
        return current - 1;
      };
      const arr1 = [2,3,4,7,11];
      const arr2 = [1,2,3,4];
      return [
        { input: [arr1], output: calc(arr1, v) },
        { input: [arr2], output: calc(arr2, v) }
      ];
    },
    starterJs: `function findKthPositive(nums) {\n  \n}`,
    starterPy: `def findKthPositive(nums):\n    pass`,
    starterCpp: `class Solution {\npublic:\n    int findKthPositive(vector<int>& nums) {\n        return 0;\n    }\n};`
  }
];

// 10 base templates. 
// We will iterate v from 2 to 61 (60 variations) for each template
// 10 templates * 60 variations = 600 unique problems!

for (let i = 0; i < templates.length; i++) {
  const tpl = templates[i];
  
  for (let v = 2; v <= 61; v++) {
    if (generatedCount >= 600) break;
    
    // We adjust v for specific templates if needed to keep it logical
    let realV = v;
    if (tpl.logic === 'find_kth_largest') {
      realV = v % 15 + 1; // 1st to 15th largest to avoid huge arrays
    }
    
    const pId = `${tpl.logic}-var-${v}`;
    
    // Fix starter code to hardcode target if needed for JS/Py/Cpp since we removed it from signature
    let jsCode = tpl.starterJs;
    let pyCode = tpl.starterPy;
    let cppCode = tpl.starterCpp;
    
    if (tpl.logic === 'two_sum_fixed') {
      jsCode = `function twoSum(nums) {\n  const target = ${realV};\n  for(let i=0; i<nums.length; i++){\n    for(let j=i+1; j<nums.length; j++){\n      if(nums[i]+nums[j]===target) return [i,j];\n    }\n  }\n  return [];\n}`;
      pyCode = `def twoSum(nums):\n    target = ${realV}\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`;
      cppCode = `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums) {\n        int target = ${realV};\n        for(int i=0; i<nums.size(); i++) {\n            for(int j=i+1; j<nums.size(); j++) {\n                if(nums[i]+nums[j] == target) return {i, j};\n            }\n        }\n        return {};\n    }\n};`;
    }

    const pTitle = tpl.getTitle(realV);
    const pDesc = tpl.getDesc(realV);
    const tests = tpl.generateTests(realV);
    
    const pExamples = JSON.stringify([
      { input: tests[0].input.map(x => JSON.stringify(x)).join(', '), output: JSON.stringify(tests[0].output) }
    ]);
    
    const pConstraints = JSON.stringify([
      "See description for problem-specific limits."
    ]);
    
    const sigParts = tpl.sig.split('->');
    const nameAndArgs = sigParts[0].trim();
    const retType = sigParts[1].trim();
    const fnName = nameAndArgs.split('(')[0];
    const argsStr = nameAndArgs.split('(')[1].replace(')', '');
    
    const params = argsStr.split(',').map(s => {
      const [n, typ] = s.split(':');
      return { name: n.trim(), type: typ.trim() };
    });
    
    const pSignature = JSON.stringify({
      name: fnName,
      params: params,
      returns: retType
    });
    
    const pStarterCode = JSON.stringify({
      javascript: jsCode,
      python: pyCode,
      cpp: cppCode
    });
    
    const pTestCases = JSON.stringify(tests.map(t => ({
      input: t.input,
      expected: t.output
    })));

    try {
      insertStmt.run(pId, pTitle, tpl.topic, tpl.difficulty, pDesc, pExamples, pConstraints, pSignature, pStarterCode, pTestCases);
      generatedCount++;
    } catch (e) {
      // duplicate or error
      console.log(e);
    }
  }
}

console.log(`Successfully generated and inserted ${generatedCount} unique Data Structure & Algorithm problems into the database!`);
