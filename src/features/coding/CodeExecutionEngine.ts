// ============================================================
// Code Execution Engine (Client-side JS Sandbox)
// ============================================================

import type { CodingProblem, TestCase, DataType } from '../../data/codingProblems';

export interface ExecutionResult {
  status: 'Passed' | 'Failed' | 'Error';
  message?: string;
  passedCount: number;
  totalCount: number;
  stdout: string[];
  executionTimeMs: number;
}

export async function executeJavaScript(userCode: string, testCases: TestCase[], functionName: string): Promise<ExecutionResult> {
  const stdout: string[] = [];
  let passedCount = 0;
  const originalLog = console.log;
  const mockConsole = {
    log: (...args: any[]) => {
      stdout.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    }
  };
  const startTime = performance.now();
  try {
    const wrappedCode = `
      return (function() {
        const console = mockConsole;
        ${userCode}
        if (typeof ${functionName} !== 'function') {
          throw new Error('Function ' + '${functionName}' + ' is not defined.');
        }
        return ${functionName};
      })();
    `;
    const evaluator = new Function('mockConsole', wrappedCode);
    const userFn = evaluator(mockConsole);
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const inputClone = JSON.parse(JSON.stringify(tc.input));
      const result = userFn(...inputClone);
      if (JSON.stringify(result) === JSON.stringify(tc.expected)) {
        passedCount++;
      } else {
        return {
          status: 'Failed',
          message: `Test Case ${i + 1} Failed.\nInput: ${JSON.stringify(tc.input)}\nExpected: ${JSON.stringify(tc.expected)}\nOutput: ${JSON.stringify(result)}`,
          passedCount, totalCount: testCases.length, stdout,
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }
    }
    return { status: 'Passed', passedCount, totalCount: testCases.length, stdout, executionTimeMs: Math.round(performance.now() - startTime) };
  } catch (err: any) {
    return { status: 'Error', message: err.message || String(err), passedCount, totalCount: testCases.length, stdout, executionTimeMs: Math.round(performance.now() - startTime) };
  } finally {
    console.log = originalLog;
  }
}

export function extractFunctionName(code: string): string {
  const match = code.match(/(?:function|def)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
  return match ? match[1] : 'solution';
}

export async function executePython(userCode: string, testCases: TestCase[], functionName: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  const escapedTestCases = JSON.stringify(testCases).replace(/\\/g, '\\\\');
  const runner = `
import json, sys, time
${userCode}
test_cases = json.loads("""${escapedTestCases}""")
passed = 0
stdout = []
class StdoutCapture:
    def write(self, text):
        if text.strip(): stdout.append(text.strip())
    def flush(self): pass
sys.stdout = StdoutCapture()
try:
    func = globals().get('${functionName}')
    if not func:
        sys.stdout = sys.__stdout__
        print(json.dumps({"status": "Error", "message": f"Function ${functionName} not found", "passedCount": 0}))
        sys.exit(0)
    start_time = time.time()
    for i, tc in enumerate(test_cases):
        try:
            result = func(*tc['input'])
            if result == tc['expected']: passed += 1
            else:
                sys.stdout = sys.__stdout__
                print(json.dumps({"status": "Failed", "message": f"Test Case {i+1} Failed.\\nInput: {tc['input']}\\nExpected: {tc['expected']}\\nOutput: {result}", "passedCount": passed, "stdout": stdout, "executionTimeMs": int((time.time() - start_time) * 1000)}))
                sys.exit(0)
        except Exception as e:
            sys.stdout = sys.__stdout__
            print(json.dumps({"status": "Error", "message": str(e), "passedCount": passed, "stdout": stdout, "executionTimeMs": int((time.time() - start_time) * 1000)}))
            sys.exit(0)
    sys.stdout = sys.__stdout__
    print(json.dumps({"status": "Passed", "passedCount": passed, "stdout": stdout, "executionTimeMs": int((time.time() - start_time) * 1000)}))
except Exception as e:
    sys.stdout = sys.__stdout__
    print(json.dumps({"status": "Error", "message": str(e), "passedCount": passed, "stdout": [], "executionTimeMs": 0}))
`;
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'python', version: '*', files: [{ content: runner }] })
    });
    const data = await response.json();
    if (data.message) return { status: 'Error', message: data.message, passedCount: 0, totalCount: testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    if (!data.run) return { status: 'Error', message: JSON.stringify(data), passedCount: 0, totalCount: testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    if (data.compile && data.compile.code !== 0) return { status: 'Error', message: data.compile.output, passedCount: 0, totalCount: testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    const outLines = data.run.output.trim().split('\n');
    const res = JSON.parse(outLines[outLines.length - 1]);
    return { status: res.status || 'Error', message: res.message, passedCount: res.passedCount || 0, totalCount: testCases.length, stdout: res.stdout || [], executionTimeMs: res.executionTimeMs || Math.round(performance.now() - startTime) };
  } catch (err: any) {
    return { status: 'Error', message: err.message || 'Execution failed', passedCount: 0, totalCount: testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
  }
}

function getCppType(type: DataType): string {
    switch(type) {
        case 'integer': return 'int';
        case 'string': return 'string';
        case 'boolean': return 'bool';
        case 'integer[]': return 'vector<int>';
        case 'string[]': return 'vector<string>';
        case 'integer[][]': return 'vector<vector<int>>';
        case 'char[]': return 'vector<char>';
        default: return 'int';
    }
}

function getCppVal(type: DataType, val: any): string {
    if (type === 'integer') return String(val);
    if (type === 'boolean') return val ? 'true' : 'false';
    if (type === 'string') return `"${val}"`;
    if (type === 'char[]') {
        if (!val || val.length === 0) return '{}';
        return '{' + val.map((c:any) => `'${c}'`).join(', ') + '}';
    }
    if (type === 'integer[]' || type === 'string[]') {
        if (!val || val.length === 0) return '{}';
        if (type === 'string[]') return '{' + val.map((v:any) => `"${v}"`).join(', ') + '}';
        return '{' + val.join(', ') + '}';
    }
    if (type === 'integer[][]') {
        if (!val || val.length === 0) return '{}';
        return '{' + val.map((arr:any) => '{' + arr.join(', ') + '}').join(', ') + '}';
    }
    return String(val);
}

function generateCppRunner(userCode: string, problem: CodingProblem): string {
    const sig = problem.signature;
    if (!sig) return '#error "Missing signature"';
    
    let runner = `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\n${userCode}\n\nint main() {\n    Solution sol;\n    int passed = 0;\n`;
    
    problem.testCases.forEach((tc, i) => {
        runner += `    {\n`;
        sig.params.forEach((param, j) => {
            runner += `        ${getCppType(param.type)} ${param.name} = ${getCppVal(param.type, tc.input[j])};\n`;
        });
        
        const callArgs = sig.params.map(p => p.name).join(', ');
        runner += `        auto res = sol.${sig.name}(${callArgs});\n`;
        runner += `        ${getCppType(sig.returns)} exp = ${getCppVal(sig.returns, tc.expected)};\n`;
        runner += `        if (res == exp) passed++;\n`;
        runner += `        else { cout << "Failed|" << ${i} << endl; return 0; }\n    }\n`;
    });
    
    runner += `    cout << "Passed|" << passed << endl;\n    return 0;\n}\n`;
    return runner;
}

export async function executeCpp(userCode: string, problem: CodingProblem): Promise<ExecutionResult> {
    const startTime = performance.now();
    const runner = generateCppRunner(userCode, problem);
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: 'c++', version: '*', files: [{ content: runner }] })
        });
        const data = await response.json();
        if (data.message) return { status: 'Error', message: data.message, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        if (!data.run) return { status: 'Error', message: JSON.stringify(data), passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        if (data.compile && data.compile.code !== 0) return { status: 'Error', message: data.compile.output, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        const output = data.run.output.trim();
        if (output.startsWith('Passed|')) return { status: 'Passed', passedCount: parseInt(output.split('|')[1]), totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        else if (output.startsWith('Failed|')) {
            const tcIndex = parseInt(output.split('|')[1]);
            const tc = problem.testCases[tcIndex];
            return { status: 'Failed', message: `Test Case ${tcIndex + 1} Failed.\nInput: ${JSON.stringify(tc.input)}\nExpected: ${JSON.stringify(tc.expected)}`, passedCount: tcIndex, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        }
        return { status: 'Error', message: output || 'Unknown error (Make sure class is Solution)', passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    } catch (err: any) {
        return { status: 'Error', message: err.message, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    }
}

function generateCRunner(userCode: string, problem: CodingProblem): string {
    const sig = problem.signature;
    if (!sig) return '#error "Missing signature"';
    
    let runner = `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n${userCode}\n\nint main() {\n    int passed = 0;\n`;
    
    problem.testCases.forEach((tc, i) => {
        runner += `    {\n`;
        
        let callArgs = [];
        sig.params.forEach((param, j) => {
            if (param.type === 'integer') {
                runner += `        int ${param.name} = ${tc.input[j]};\n`;
                callArgs.push(param.name);
            } else if (param.type === 'string') {
                runner += `        char ${param.name}[] = "${tc.input[j]}";\n`;
                callArgs.push(param.name);
            } else if (param.type === 'integer[]') {
                let init = tc.input[j].length ? `{${tc.input[j].join(', ')}}` : `{}`;
                runner += `        int ${param.name}Data[] = ${init};\n`;
                runner += `        int* ${param.name} = ${tc.input[j].length ? param.name + "Data" : "NULL"};\n`;
                callArgs.push(param.name);
                callArgs.push(tc.input[j].length);
            } else if (param.type === 'char[]') {
                let chars = tc.input[j].map((c:string)=>`'${c}'`).join(', ');
                runner += `        char ${param.name}[] = {${chars}${chars ? ',' : ''} '\\0'};\n`;
                callArgs.push(param.name);
                callArgs.push(tc.input[j].length);
            }
        });
        
        if (sig.returns === 'integer[]' || sig.returns === 'char[]' || sig.name === 'twoSum') {
            callArgs.push('&returnSize');
            runner += `        int returnSize = 0;\n`;
        }
        if (sig.name === 'merge') {
            callArgs.push('&returnColSizes');
            runner += `        int* returnColSizes = NULL;\n`;
        }
        
        let retType = 'int';
        if (sig.returns === 'boolean') retType = 'bool';
        if (sig.returns === 'integer[]') retType = 'int*';
        if (sig.returns === 'char[]') retType = 'char*';
        if (sig.returns === 'integer[][]') retType = 'int**';
        
        runner += `        ${retType} res = ${sig.name}(${callArgs.join(', ')});\n`;
        
        if (sig.returns === 'integer' || sig.returns === 'boolean') {
            runner += `        ${retType} exp = ${tc.expected};\n`;
            runner += `        if (res == exp) passed++;\n`;
        } else if (sig.returns === 'integer[]') {
            runner += `        int exp[] = {${tc.expected.join(', ')}${tc.expected.length ? '' : '0'}};\n`;
            runner += `        bool ok = (returnSize == ${tc.expected.length});\n`;
            runner += `        for(int k=0; k<returnSize && ok; k++) if(res[k] != exp[k]) ok = false;\n`;
            runner += `        if (ok) passed++;\n`;
        } else if (sig.returns === 'char[]') {
            let eChars = tc.expected.map((c:string)=>`'${c}'`).join(', ');
            runner += `        char exp[] = {${eChars}${eChars ? ',' : ''} '\\0'};\n`;
            runner += `        if (strcmp(res, exp) == 0) passed++;\n`;
        } else {
            runner += `        passed++;\n`;
        }
        runner += `        else { printf("Failed|%d\\n", ${i}); return 0; }\n    }\n`;
    });
    
    runner += `    printf("Passed|%d\\n", passed);\n    return 0;\n}\n`;
    return runner;
}

export async function executeC(userCode: string, problem: CodingProblem): Promise<ExecutionResult> {
    const startTime = performance.now();
    const runner = generateCRunner(userCode, problem);
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: 'c', version: '*', files: [{ content: runner }] })
        });
        const data = await response.json();
        if (data.message) return { status: 'Error', message: data.message, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        if (!data.run) return { status: 'Error', message: JSON.stringify(data), passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        if (data.compile && data.compile.code !== 0) return { status: 'Error', message: data.compile.output, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        const output = data.run.output.trim();
        if (output.startsWith('Passed|')) return { status: 'Passed', passedCount: parseInt(output.split('|')[1]), totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        else if (output.startsWith('Failed|')) {
            const tcIndex = parseInt(output.split('|')[1]);
            const tc = problem.testCases[tcIndex];
            return { status: 'Failed', message: `Test Case ${tcIndex + 1} Failed.\nInput: ${JSON.stringify(tc.input)}\nExpected: ${JSON.stringify(tc.expected)}`, passedCount: tcIndex, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
        }
        return { status: 'Error', message: output || 'Unknown execution error', passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    } catch (err: any) {
        return { status: 'Error', message: err.message, passedCount: 0, totalCount: problem.testCases.length, stdout: [], executionTimeMs: Math.round(performance.now() - startTime) };
    }
}
