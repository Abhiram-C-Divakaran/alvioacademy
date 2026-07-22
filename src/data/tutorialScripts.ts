// ============================================================
// Tutorial Scripts for Interactive 3D Educational Mode
// ============================================================

export type TutorialActionType = 'insert' | 'delete' | 'search' | 'info';

export interface TutorialStep {
  text: string;
  actionType: TutorialActionType;
  value?: number; // The value to insert/delete/search
}

export interface TutorialScript {
  id: string; // matches DataStructure type (e.g. 'array', 'stack')
  title: string;
  steps: TutorialStep[];
}

export const tutorialScripts: Record<string, TutorialScript> = {
  array: {
    id: 'array',
    title: 'Array Data Structure',
    steps: [
      { text: "Welcome to the Array tutorial! An array stores elements in contiguous memory. Let's start with an empty array.", actionType: 'info' },
      { text: "Let's insert the number 15. Because the array was empty, it goes into index 0.", actionType: 'insert', value: 15 },
      { text: "Now let's insert 42. It gets appended to the end of the array at index 1.", actionType: 'insert', value: 42 },
      { text: "Let's insert 8. It goes into index 2. Notice how they are perfectly lined up in memory.", actionType: 'insert', value: 8 },
      { text: "If we want to search for 42, the computer has to scan through the array to find its index. Since we know the index, we can access it instantly in O(1) time!", actionType: 'search', value: 42 },
      { text: "Now let's delete 15. The element is removed, and in a real array, elements might need to be shifted.", actionType: 'delete', value: 15 },
      { text: "That's the basics of Arrays! Great for fast lookups, but resizing and shifting elements can be slow.", actionType: 'info' }
    ]
  },
  stack: {
    id: 'stack',
    title: 'Stack (LIFO)',
    steps: [
      { text: "Welcome to the Stack tutorial! A stack follows LIFO: Last In, First Out. Think of it like a stack of plates.", actionType: 'info' },
      { text: "Let's 'push' the number 10 onto the stack.", actionType: 'insert', value: 10 },
      { text: "Now let's push 20. It goes directly on top of 10. The 'Top' pointer moves up.", actionType: 'insert', value: 20 },
      { text: "Pushing 30 goes on top of 20.", actionType: 'insert', value: 30 },
      { text: "Now, if we 'pop' (delete), we MUST remove the very top element. We can't take from the bottom!", actionType: 'delete', value: 30 },
      { text: "See how 30 was removed? Stacks are heavily used in Undo mechanisms and function call stacks.", actionType: 'info' }
    ]
  },
  queue: {
    id: 'queue',
    title: 'Queue (FIFO)',
    steps: [
      { text: "Welcome to the Queue tutorial! A queue follows FIFO: First In, First Out. Think of it like a line at a store.", actionType: 'info' },
      { text: "Let's 'enqueue' the number 5 into the line.", actionType: 'insert', value: 5 },
      { text: "Now enqueue 15. It goes to the back of the line.", actionType: 'insert', value: 15 },
      { text: "Enqueue 25. The line gets longer at the back.", actionType: 'insert', value: 25 },
      { text: "When we 'dequeue' (delete), the person at the FRONT of the line is served first! Let's dequeue.", actionType: 'delete', value: 5 },
      { text: "Notice how 5 was removed from the front. Queues are used for task scheduling and printer spools.", actionType: 'info' }
    ]
  },
  linked_list: {
    id: 'linked_list',
    title: 'Linked List',
    steps: [
      { text: "Welcome to the Linked List! Elements (nodes) are scattered in memory, connected by pointers.", actionType: 'info' },
      { text: "Let's insert 50. It becomes the 'Head' node.", actionType: 'insert', value: 50 },
      { text: "Let's insert 75. A new node is created and the first node points to it.", actionType: 'insert', value: 75 },
      { text: "Let's insert 100. Pointers are incredibly fast to re-assign, making insertion easy if you have the address.", actionType: 'insert', value: 100 },
      { text: "If we delete 75, the pointer from 50 simply bypasses 75 and points directly to 100!", actionType: 'delete', value: 75 },
      { text: "That's a Linked List! O(1) insertions/deletions, but O(N) access time since we have to traverse the pointers.", actionType: 'info' }
    ]
  },
  tree: {
    id: 'tree',
    title: 'Binary Search Tree',
    steps: [
      { text: "Welcome to the Binary Search Tree! Elements smaller than the root go left, larger go right.", actionType: 'info' },
      { text: "Let's insert 50 as our root node.", actionType: 'insert', value: 50 },
      { text: "Let's insert 30. Since 30 < 50, it becomes the left child.", actionType: 'insert', value: 30 },
      { text: "Let's insert 70. Since 70 > 50, it goes to the right.", actionType: 'insert', value: 70 },
      { text: "Let's insert 20. It goes left of 50, and left of 30.", actionType: 'insert', value: 20 },
      { text: "Now let's search for 70. The algorithm instantly knows to look right, cutting the search time in half! O(log N) time.", actionType: 'search', value: 70 },
      { text: "Deleting a leaf node like 20 is simple. Deleting a parent requires finding an in-order successor.", actionType: 'delete', value: 20 },
      { text: "Trees are incredibly powerful for fast data retrieval!", actionType: 'info' }
    ]
  },
  graph: {
    id: 'graph',
    title: 'Graph',
    steps: [
      { text: "Welcome to Graphs! They consist of vertices (nodes) connected by edges. They map out networks.", actionType: 'info' },
      { text: "Let's insert node 1.", actionType: 'insert', value: 1 },
      { text: "Let's insert node 2. Watch how an edge might form between them.", actionType: 'insert', value: 2 },
      { text: "Let's insert node 3 to expand our network.", actionType: 'insert', value: 3 },
      { text: "Graphs are used for GPS navigation, social networks, and the Internet itself!", actionType: 'info' }
    ]
  }
};
