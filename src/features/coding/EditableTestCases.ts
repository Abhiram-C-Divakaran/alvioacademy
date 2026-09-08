import type { TestCase } from '../../data/codingProblems';

export interface EditableTestCase {
  input: string[];
  expected: string;
}

export function formatInputAsArray(input: any): any[] {
  if (Array.isArray(input)) return input;
  if (input === undefined || input === null) return [];
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // A scalar string is a single argument.
    }
  }
  return [input];
}

export function getLocalTestCasesFromProblem(problem: { testCases?: unknown }): EditableTestCase[] {
  let testCases = problem?.testCases;
  if (typeof testCases === 'string') {
    try {
      testCases = JSON.parse(testCases);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(testCases)) return [];

  // Every editor field contains JSON, including strings. Otherwise "100"
  // becomes the number 100 when the learner runs an unchanged test case.
  return testCases.map(tc => ({
    input: formatInputAsArray(tc?.input).map(value => JSON.stringify(value) ?? ''),
    expected: JSON.stringify(tc?.expected) ?? ''
  }));
}

export function parseEditableTestCases(testCases: EditableTestCase[]): TestCase[] {
  const parseValue = (value: string) => {
    try { return JSON.parse(value); } catch { return value; }
  };
  return testCases.map(tc => ({
    input: tc.input.map(parseValue),
    expected: parseValue(tc.expected)
  }));
}
