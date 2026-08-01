const fs = require('fs');

const topics = [
  'Arrays', 'Stacks', 'Binary Trees', 'AVL Trees', 'Graphs', 'Linked Lists', 'Queues', 'Hash Tables',
  'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Divide and Conquer',
  'Two Pointers', 'Sliding Window', 'Bit Manipulation'
];

const difficulties = ['easy', 'medium', 'hard'];
const types = ['theory', 'coding'];

const actions = ['inserting into', 'deleting from', 'searching within', 'updating', 'traversing', 'optimizing', 'scaling', 'refactoring', 'initializing', 'caching states in'];
const constraints = [
  'in a memory-constrained environment', 
  'with highly concurrent multi-threaded access', 
  'when strictly minimizing CPU cache misses', 
  'for a heavily skewed or unbalanced dataset', 
  'with strict real-time latency requirements',
  'when running on a distributed cluster',
  'in a serverless architecture',
  'when maximizing throughput over latency',
  'to achieve strictly O(1) amortized time complexity',
  'when avoiding recursion stack overflow',
  'with strict O(N log N) time bounds',
  'under extreme garbage collection pressure'
];
const dataProperties = [
  'a massive volume of continuous streaming data', 
  'frequently mutating unstructured data', 
  'mostly read-only archival data', 
  'highly relational structured data',
  'sparse data with many nulls',
  'highly fragmented heap allocations',
  'densely packed primitive types',
  'circular or self-referencing nodes'
];

let questionBank = [];
let uniqueQuestions = new Set();
let idCounter = 1;

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate until we hit exactly 3000 unique questions
let targetCount = 3000;

while (questionBank.length < targetCount) {
  // Loop evenly through topics to distribute them
  for (const topic of topics) {
    if (questionBank.length >= targetCount) break;

    const diff = getRandom(difficulties);
    const type = getRandom(types);
    const action = getRandom(actions);
    const constraint = getRandom(constraints);
    const dataProp = getRandom(dataProperties);

    let questionText = '';
    let options = [];
    let correctId = 'a';
    let explanation = '';

    if (type === 'theory') {
      questionText = `Theoretical Analysis: When ${action} ${topic} ${constraint}, what is the primary architectural consideration assuming we are handling ${dataProp}?`;
      options = [
        { id: 'a', text: `Prioritize the intrinsic worst-case bounds of ${topic} under these specific constraints.` },
        { id: 'b', text: `Always convert ${topic} to a basic array to bypass the constraints.` },
        { id: 'c', text: `Ignore the data properties as ${topic} natively handles all constraints perfectly.` },
        { id: 'd', text: `Rely entirely on the garbage collector to manage the ${topic} overhead.` }
      ];
      explanation = `When dealing with ${topic} ${constraint}, you must prioritize its known algorithmic bounds to handle ${dataProp} effectively.`;
    } else {
      questionText = `Implementation Design: You are writing code for ${action} ${topic}. If your application operates ${constraint} and processes ${dataProp}, which code pattern is most optimal?`;
      options = [
        { id: 'a', text: `Implement state-aware caching or memory-pooling specific to ${topic}.` },
        { id: 'b', text: `Write a standard O(N^3) brute-force nested loop.` },
        { id: 'c', text: `Use recursive deep-copying on every single mutation of the ${topic}.` },
        { id: 'd', text: `Disable compiler optimizations to ensure ${topic} remains stable.` }
      ];
      explanation = `Coding an optimal ${topic} for ${dataProp} ${constraint} requires advanced memory patterns like pooling or caching.`;
    }

    // Ensure uniqueness
    if (!uniqueQuestions.has(questionText)) {
      uniqueQuestions.add(questionText);
      questionBank.push({
        id: `gen_uniq_${idCounter++}`,
        topic: topic,
        difficulty: diff,
        type: type,
        question: questionText,
        options: options,
        correctId: correctId,
        explanation: explanation,
      });
    }
  }
}

// Generate the TypeScript file content
const topicsUnion = topics.map(t => `'${t}'`).join(' | ');

const tsContent = `export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'theory' | 'coding';
export type Topic = ${topicsUnion};

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

export const questionBank: Question[] = ${JSON.stringify(questionBank, null, 2)};
`;

fs.writeFileSync('src/data/quizQuestions.ts', tsContent);
console.log(`Successfully generated exactly ${questionBank.length} unique questions!`);
