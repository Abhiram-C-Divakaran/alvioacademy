export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'theory' | 'coding';
export type Topic = 'Arrays' | 'Stacks' | 'Binary Trees' | 'AVL Trees' | 'Graphs' | 'Linked Lists' | 'Queues' | 'Hash Tables';

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

export const questionBank: Question[] = [
  // ==========================================
  // ARRAYS
  // ==========================================
  {
    id: 'arr_t_e_1',
    topic: 'Arrays',
    difficulty: 'easy',
    type: 'theory',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: [
      { id: 'a', text: 'O(1)' },
      { id: 'b', text: 'O(n)' },
      { id: 'c', text: 'O(log n)' },
      { id: 'd', text: 'O(n²)' },
    ],
    correctId: 'a',
    explanation: 'Arrays provide O(1) constant-time access because elements are stored in contiguous memory locations, and the index directly maps to a memory address.',
  },
  {
    id: 'arr_t_e_2',
    topic: 'Arrays',
    difficulty: 'easy',
    type: 'theory',
    question: 'Which of the following operations is generally most expensive for a standard dynamic array (like std::vector or ArrayList)?',
    options: [
      { id: 'a', text: 'Accessing the last element' },
      { id: 'b', text: 'Appending an element to the end (amortized)' },
      { id: 'c', text: 'Inserting an element at the beginning' },
      { id: 'd', text: 'Updating an element at a given index' },
    ],
    correctId: 'c',
    explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, which takes O(n) time.',
  },
  {
    id: 'arr_c_e_1',
    topic: 'Arrays',
    difficulty: 'easy',
    type: 'coding',
    question: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Which approach offers the best time complexity?',
    codeSnippet: 'def twoSum(nums, target):\n    # implementation here',
    options: [
      { id: 'a', text: 'Nested loops checking all pairs - O(n²)' },
      { id: 'b', text: 'Sorting the array and using binary search - O(n log n)' },
      { id: 'c', text: 'Using a Hash Map to store needed complements - O(n)' },
      { id: 'd', text: 'Using a single pass with two pointers on unsorted array - O(n)' },
    ],
    correctId: 'c',
    explanation: 'A Hash Map allows O(1) lookups. As we iterate, we check if the complement (target - current_val) exists in the map, achieving an overall O(n) time complexity.',
  },
  {
    id: 'arr_c_m_1',
    topic: 'Arrays',
    difficulty: 'medium',
    type: 'coding',
    question: 'You are given an integer array `nums`. You want to find the maximum sum of a contiguous subarray. What is the name of the most efficient algorithm for this, and what is its time complexity?',
    options: [
      { id: 'a', text: 'Kadane\'s Algorithm, O(n)' },
      { id: 'b', text: 'Sliding Window, O(n)' },
      { id: 'c', text: 'Divide and Conquer, O(n log n)' },
      { id: 'd', text: 'Dynamic Programming (2D table), O(n²)' },
    ],
    correctId: 'a',
    explanation: 'Kadane\'s Algorithm maintains a running maximum sum. If the running sum drops below zero, it resets to zero. It scans the array once, taking O(n) time.',
  },
  {
    id: 'arr_c_m_2',
    topic: 'Arrays',
    difficulty: 'medium',
    type: 'coding',
    question: 'How do you optimally solve the "Container With Most Water" problem using an array of heights?',
    codeSnippet: 'def maxArea(height):\n    left = 0\n    right = len(height) - 1\n    max_area = 0\n    while left < right:\n        # What goes here?\n        pass',
    options: [
      { id: 'a', text: 'Move the pointer that points to the shorter line inward.' },
      { id: 'b', text: 'Move the pointer that points to the taller line inward.' },
      { id: 'c', text: 'Always move both pointers inward.' },
      { id: 'd', text: 'Move left if height[left] is even, else move right.' },
    ],
    correctId: 'a',
    explanation: 'The area is limited by the shorter line. Moving the taller line inward can only decrease the area (since width decreases), but moving the shorter line might find a taller line that compensates for the lost width.',
  },
  {
    id: 'arr_c_h_1',
    topic: 'Arrays',
    difficulty: 'hard',
    type: 'coding',
    question: 'In the "Trapping Rain Water" problem, what is an optimal approach that achieves O(1) extra space?',
    options: [
      { id: 'a', text: 'Precomputing left_max and right_max arrays (O(n) space).' },
      { id: 'b', text: 'Using a monotonic decreasing stack (O(n) space).' },
      { id: 'c', text: 'Using two pointers moving from both ends, keeping track of left_max and right_max (O(1) space).' },
      { id: 'd', text: 'It cannot be solved in O(1) extra space without modifying the input array.' },
    ],
    correctId: 'c',
    explanation: 'The Two Pointer approach maintains a left_max and right_max integer. Since water trapped at a specific bar depends on the minimum of the max heights on both sides, we can safely compute it if one max is strictly smaller than the other.',
  },

  // ==========================================
  // STACKS
  // ==========================================
  {
    id: 'stk_t_e_1',
    topic: 'Stacks',
    difficulty: 'easy',
    type: 'theory',
    question: 'Which principle governs the Stack data structure?',
    options: [
      { id: 'a', text: 'FIFO (First In, First Out)' },
      { id: 'b', text: 'LIFO (Last In, First Out)' },
      { id: 'c', text: 'Random Access' },
      { id: 'd', text: 'Priority-based' },
    ],
    correctId: 'b',
    explanation: 'A Stack follows Last-In-First-Out. The last item pushed is the first item popped.',
  },
  {
    id: 'stk_c_e_1',
    topic: 'Stacks',
    difficulty: 'easy',
    type: 'coding',
    question: 'When using a stack to check for balanced parentheses (e.g., "{[()]}"), what is the condition for a string to be considered balanced at the end of iteration?',
    options: [
      { id: 'a', text: 'The stack must contain exactly one element.' },
      { id: 'b', text: 'The stack must be empty.' },
      { id: 'c', text: 'The stack size must match the string length.' },
      { id: 'd', text: 'The stack top must be a closing bracket.' },
    ],
    correctId: 'b',
    explanation: 'If the string is perfectly balanced, every opening bracket pushed onto the stack will be popped off by its corresponding closing bracket, leaving the stack empty.',
  },
  {
    id: 'stk_c_m_1',
    topic: 'Stacks',
    difficulty: 'medium',
    type: 'coding',
    question: 'How do you design a MinStack that supports push, pop, top, and retrieving the minimum element all in O(1) time?',
    options: [
      { id: 'a', text: 'Scan the stack on every getMin() call.' },
      { id: 'b', text: 'Maintain a single variable `min_val` and update it.' },
      { id: 'c', text: 'Use an auxiliary stack to keep track of the minimums up to each level.' },
      { id: 'd', text: 'Sort the stack after every insertion.' },
    ],
    correctId: 'c',
    explanation: 'An auxiliary stack stores the minimum value seen so far. When you push to the main stack, you push min(val, current_min) to the aux stack. Popping from both keeps them synchronized in O(1) time.',
  },
  {
    id: 'stk_c_h_1',
    topic: 'Stacks',
    difficulty: 'hard',
    type: 'coding',
    question: 'In the "Largest Rectangle in Histogram" problem, how is a monotonic stack utilized efficiently?',
    codeSnippet: 'def largestRectangleArea(heights):\n    stack = [] # What does this store?\n    max_area = 0\n    ...',
    options: [
      { id: 'a', text: 'It stores the heights in strictly decreasing order.' },
      { id: 'b', text: 'It stores indices of the bars in non-decreasing order of their heights.' },
      { id: 'c', text: 'It stores the cumulative sums of the heights.' },
      { id: 'd', text: 'It stores the areas of rectangles calculated so far.' },
    ],
    correctId: 'b',
    explanation: 'By storing indices where heights are in non-decreasing order, when we encounter a shorter bar, we know the right boundary for the taller bars in the stack, allowing us to compute their area efficiently.',
  },

  // ==========================================
  // BINARY TREES
  // ==========================================
  {
    id: 'bt_t_e_1',
    topic: 'Binary Trees',
    difficulty: 'easy',
    type: 'theory',
    question: 'In a standard Binary Search Tree (BST), what is the relationship between a parent node and its children?',
    options: [
      { id: 'a', text: 'Left child < Parent < Right child' },
      { id: 'b', text: 'Left child > Parent > Right child' },
      { id: 'c', text: 'Parent < Both children' },
      { id: 'd', text: 'No strict ordering, just max 2 children' },
    ],
    correctId: 'a',
    explanation: 'A BST ensures that all nodes in the left subtree have values less than the parent, and all nodes in the right subtree have values greater than the parent.',
  },
  {
    id: 'bt_c_e_1',
    topic: 'Binary Trees',
    difficulty: 'easy',
    type: 'coding',
    question: 'Which Depth-First Search (DFS) traversal visits the nodes of a BST in ascending sorted order?',
    options: [
      { id: 'a', text: 'Pre-order (Root, Left, Right)' },
      { id: 'b', text: 'In-order (Left, Root, Right)' },
      { id: 'c', text: 'Post-order (Left, Right, Root)' },
      { id: 'd', text: 'Level-order (Breadth-First)' },
    ],
    correctId: 'b',
    explanation: 'In-order traversal visits the smaller left subtree first, then the node itself, then the larger right subtree, naturally yielding sorted order for a BST.',
  },
  {
    id: 'bt_c_m_1',
    topic: 'Binary Trees',
    difficulty: 'medium',
    type: 'coding',
    question: 'When finding the Lowest Common Ancestor (LCA) of two nodes p and q in a Binary Tree (not a BST), what condition indicates that the current node is the LCA?',
    options: [
      { id: 'a', text: 'The node\'s value is between p and q.' },
      { id: 'b', text: 'Both left and right recursive calls return non-null values.' },
      { id: 'c', text: 'The node has exactly two children.' },
      { id: 'd', text: 'The node is the root of the tree.' },
    ],
    correctId: 'b',
    explanation: 'If the recursive call on the left subtree returns a node (e.g., p) and the right returns a node (e.g., q), it means p and q are in different subtrees of the current node, making it their lowest common ancestor.',
  },
  {
    id: 'bt_c_h_1',
    topic: 'Binary Trees',
    difficulty: 'hard',
    type: 'coding',
    question: 'For the "Binary Tree Maximum Path Sum" problem, a path can start and end at any node. What must a recursive function return to its parent, vs what does it update globally?',
    codeSnippet: 'def maxPathSum(root):\n    res = [-float("inf")]\n    def dfs(node):\n        # returns ?\n        # updates res[0] ?\n        pass\n    dfs(root)\n    return res[0]',
    options: [
      { id: 'a', text: 'Returns max sum including both children; Updates global max with path including one child.' },
      { id: 'b', text: 'Returns max sum of a path continuing down ONE branch; Updates global max with path potentially bridging BOTH branches.' },
      { id: 'c', text: 'Returns the total sum of the subtree; Updates nothing globally.' },
      { id: 'd', text: 'Returns the depth of the tree; Updates global max with depth * node.val.' },
    ],
    correctId: 'b',
    explanation: 'A valid path can only branch once. Thus, a node can bridge its left and right subtrees (updating the global max), but it can only return a straight path down one branch to its parent to be part of a larger path.',
  },

  // ==========================================
  // AVL TREES
  // ==========================================
  {
    id: 'avl_t_e_1',
    topic: 'AVL Trees',
    difficulty: 'easy',
    type: 'theory',
    question: 'What defines the "balance factor" of a node in an AVL tree?',
    options: [
      { id: 'a', text: 'Number of nodes in left subtree - Number of nodes in right subtree' },
      { id: 'b', text: 'Height of left subtree - Height of right subtree' },
      { id: 'c', text: 'Value of left child - Value of right child' },
      { id: 'd', text: 'Total height of the tree' },
    ],
    correctId: 'b',
    explanation: 'The balance factor is calculated as height(left) - height(right). In a valid AVL tree, this factor must be -1, 0, or 1 for every node.',
  },
  {
    id: 'avl_c_m_1',
    topic: 'AVL Trees',
    difficulty: 'medium',
    type: 'coding',
    question: 'If a node in an AVL tree has a balance factor of +2, and its left child has a balance factor of -1, what rotation(s) are required to restore balance?',
    options: [
      { id: 'a', text: 'Single Right Rotation' },
      { id: 'b', text: 'Single Left Rotation' },
      { id: 'c', text: 'Left-Right Rotation (Left on child, Right on parent)' },
      { id: 'd', text: 'Right-Left Rotation (Right on child, Left on parent)' },
    ],
    correctId: 'c',
    explanation: 'This is a "Left-Right" heavy case. We first perform a Left rotation on the left child to align the nodes (making it Left-Left heavy), then a Right rotation on the unbalanced parent.',
  },
  {
    id: 'avl_t_h_1',
    topic: 'AVL Trees',
    difficulty: 'hard',
    type: 'theory',
    question: 'What is the maximum time complexity for insertion in an AVL tree, and why?',
    options: [
      { id: 'a', text: 'O(1) - Rotations take constant time.' },
      { id: 'b', text: 'O(log n) - Finding the insertion point takes O(log n), and at most O(log n) rotations might be needed.' },
      { id: 'c', text: 'O(n) - The tree might become a linked list.' },
      { id: 'd', text: 'O(n log n) - Rebuilding the tree takes longer.' },
    ],
    correctId: 'b',
    explanation: 'Because an AVL tree is always strictly height-balanced, the height is bounded by O(log n). Traversing down takes O(log n), and updating balance factors/rotating back up takes at most O(log n) steps.',
  },

  // ==========================================
  // GRAPHS
  // ==========================================
  {
    id: 'graph_t_e_1',
    topic: 'Graphs',
    difficulty: 'easy',
    type: 'theory',
    question: 'Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?',
    options: [
      { id: 'a', text: 'Stack' },
      { id: 'b', text: 'Queue' },
      { id: 'c', text: 'Min-Heap' },
      { id: 'd', text: 'Binary Search Tree' },
    ],
    correctId: 'b',
    explanation: 'A Queue ensures First-In-First-Out processing, which is necessary to visit graph nodes level-by-level based on their distance from the source.',
  },
  {
    id: 'graph_c_m_1',
    topic: 'Graphs',
    difficulty: 'medium',
    type: 'coding',
    question: 'When performing a DFS to detect a cycle in a directed graph, what state tracking is required for the nodes?',
    options: [
      { id: 'a', text: 'A single boolean visited set.' },
      { id: 'b', text: 'Three states: Unvisited, Visiting (in current path), and Fully Visited.' },
      { id: 'c', text: 'An array storing the in-degree of each node.' },
      { id: 'd', text: 'A Disjoint Set (Union-Find) data structure.' },
    ],
    correctId: 'b',
    explanation: 'To detect cycles in directed graphs, you must differentiate between nodes currently in the recursion stack ("Visiting") and nodes completely processed ("Fully Visited"). A back-edge points to a "Visiting" node.',
  },
  {
    id: 'graph_c_h_1',
    topic: 'Graphs',
    difficulty: 'hard',
    type: 'coding',
    question: 'Dijkstra\'s algorithm finds the shortest path from a source to all other nodes. Which data structure is essential for an optimal implementation (O((V+E) log V))?',
    options: [
      { id: 'a', text: 'A standard FIFO Queue' },
      { id: 'b', text: 'A Priority Queue (Min-Heap)' },
      { id: 'c', text: 'A LIFO Stack' },
      { id: 'd', text: 'An Adjacency Matrix' },
    ],
    correctId: 'b',
    explanation: 'A Min-Heap allows us to continually extract the node with the current shortest known distance in O(log V) time, which is the greedy choice that drives Dijkstra\'s algorithm.',
  }
,
  {
    id: 'll-1',
    topic: 'Linked Lists',
    difficulty: 'easy',
    type: 'theory',
    question: 'What does each node in a singly linked list contain?',
    options: [
      { id: 'a', text: 'Data and a pointer to the previous node' },
      { id: 'b', text: 'Data and a pointer to the next node' },
      { id: 'c', text: 'Only data' },
      { id: 'd', text: 'Pointers to both next and previous nodes' }
    ],
    correctId: 'b',
    explanation: 'A node in a singly linked list contains data and a reference (or pointer) to the next node in the sequence.'
  },
  {
    id: 'q-1',
    topic: 'Queues',
    difficulty: 'easy',
    type: 'theory',
    question: 'Which principle does a Queue follow?',
    options: [
      { id: 'a', text: 'LIFO (Last In First Out)' },
      { id: 'b', text: 'FIFO (First In First Out)' },
      { id: 'c', text: 'FILO (First In Last Out)' },
      { id: 'd', text: 'None of the above' }
    ],
    correctId: 'b',
    explanation: 'A queue follows the FIFO principle, where the first element added is the first one to be removed.'
  },
  {
    id: 'ht-1',
    topic: 'Hash Tables',
    difficulty: 'easy',
    type: 'theory',
    question: 'What is a hash collision?',
    options: [
      { id: 'a', text: 'When two different keys hash to the same index' },
      { id: 'b', text: 'When the hash table is full' },
      { id: 'c', text: 'When a key is missing' },
      { id: 'd', text: 'When a hash function takes too long to compute' }
    ],
    correctId: 'a',
    explanation: 'A collision occurs when the hash function maps two different keys to the exact same index in the hash table.'
  }
];