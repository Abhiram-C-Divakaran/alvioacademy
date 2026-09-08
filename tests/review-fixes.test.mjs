import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { loadProblemCatalog, seedProblemCatalog } from '../server/problemCatalog.ts';
import { getLocalTestCasesFromProblem, parseEditableTestCases } from '../src/features/coding/EditableTestCases.ts';
import * as runner from '../src/features/coding/CodeExecutionEngine.ts';
import { computePrimitives, linkedListLayout, treeLayout, graphLayout, matrixLayout } from '../src/features/visualizer/aiScene.ts';

const catalog = loadProblemCatalog();
test('catalog imports atomically, archives placeholders, and preserves saved solutions', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(`CREATE TABLE problems (id TEXT PRIMARY KEY,title TEXT,topic TEXT,difficulty TEXT,description TEXT,examples TEXT,constraints TEXT,signature TEXT,starterCode TEXT,testCases TEXT);
    CREATE TABLE user_submissions (problem_id TEXT REFERENCES problems(id),code TEXT);`);
  db.prepare('INSERT INTO problems (id,signature,description) VALUES (?,?,?)').run('bad','[]','dynamically generated placeholder');
  assert.throws(() => seedProblemCatalog(db,[{...catalog[0],signature:[]}]), /Incomplete/);
  assert.equal(db.prepare('SELECT count(*) AS n FROM problems').get().n,1);
  assert.deepEqual(seedProblemCatalog(db,catalog),{imported:472,archived:1});
  db.prepare('INSERT INTO user_submissions VALUES (?,?)').run(catalog[0].id,'saved');
  seedProblemCatalog(db,catalog);
  assert.equal(db.prepare('SELECT code FROM user_submissions').get().code,'saved');
  assert.equal(db.prepare('SELECT count(*) AS n FROM problem_catalog_archive').get().n,1);
  assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
  db.close();
});

test('editable tests preserve strings and a correct Add Binary solution passes', async () => {
  const cases=[{input:['11','1'],expected:'100'},{input:['1010','1011'],expected:'10101'}];
  const restored=parseEditableTestCases(getLocalTestCasesFromProblem({testCases:cases}));
  assert.deepEqual(restored,cases);
  const result=await runner.executeJavaScript('const addBinary = (a,b) => (parseInt(a,2)+parseInt(b,2)).toString(2);',restored,'addBinary');
  assert.equal(result.status,'Passed');
  assert.equal(runner.extractFunctionName('var twoSum = function(nums,target) {};'),'twoSum');
  assert.equal(runner.extractFunctionName('const helper=()=>0; const solve = x => x;','solve'),'solve');
});

test('all six remote runners dispatch to the correct service language', async () => {
  const original=globalThis.fetch;
  let languages=[];
  globalThis.fetch=async (url,init) => {
    if(init?.method==='POST') { languages.push(JSON.parse(init.body).language); return Response.json({id:'test'}); }
    return Response.json({status:'completed',result:'success',exit_code:0,stdout:'Passed|1'});
  };
  const p={signature:{name:'identity',params:[{name:'x',type:'integer'}],returns:'integer'},testCases:[{input:[1],expected:1}]};
  try {
    for(const [name,args] of [
      ['executePython',['def identity(x): return x',p.testCases,'identity']],
      ['executeTypescript',['function identity(x:number){return x;}',p.testCases,'identity']],
      ['executeCpp',['class Solution { public: int identity(int x){return x;} };',p]],
      ['executeC',['int identity(int x){return x;}',p]],
      ['executeJava',['class Solution { public int identity(int x){return x;} }',p]],
      ['executeCsharp',['public class Solution { public int identity(int x){return x;} }',p]],
    ]) assert.equal((await runner[name](...args)).status,'Passed',name);
    assert.deepEqual(languages,['python3','typescript','cpp','c','java','csharp']);
    globalThis.fetch=async()=>Response.json({error:'service unavailable'},{status:503});
    assert.equal((await runner.executePython('',p.testCases,'identity')).status,'Error');
  } finally {globalThis.fetch=original;}
});

test('linked lists, trees, and graphs preserve their relationships', () => {
  const list={id:'list',type:'linkedlist',initialElements:[{id:'a',value:1,next:'b'},{id:'b',value:2,next:null}]};
  const ll=linkedListLayout(list);
  assert.equal(ll.edges[0].from,'a'); assert.equal(ll.edges[0].to,'b');
  assert.ok(ll.positions.get('a')[0]<ll.positions.get('b')[0]);
  const tree=treeLayout({id:'tree',type:'tree',initialElements:[{id:'a',value:1,left:'b',right:'c'},{id:'b',value:2},{id:'c',value:3}]});
  assert.equal(tree.edges.length,2);
  assert.ok(tree.positions.get('a')[1]>tree.positions.get('b')[1]);
  assert.ok(tree.positions.get('b')[0]<tree.positions.get('c')[0]);
  const graph=graphLayout({id:'graph',type:'graph',initialElements:[{id:'a'},{id:'b'}],edges:[{id:'ab',from:'a',to:'b',directed:true}]});
  assert.equal(graph.edges[0].directed,true);
});

test('matrix coordinates render a two by two grid, regardless of cell order', () => {
  const matrix=matrixLayout({id:'m',type:'matrix',initialElements:[{id:'d',row:1,col:1},{id:'a',row:0,col:0},{id:'c',row:1,col:0},{id:'b',row:0,col:1}]});
  assert.equal(matrix.rows,2); assert.equal(matrix.columns,2);
  assert.equal(matrix.positions.get('a')[1],matrix.positions.get('b')[1]);
  assert.equal(matrix.positions.get('a')[0],matrix.positions.get('c')[0]);
  assert.notEqual(matrix.positions.get('a')[1],matrix.positions.get('c')[1]);
});

test('scene replay restores removed nodes when scrubbing backwards', () => {
  const initial=[{id:'q',type:'queue',initialElements:[{id:'a',value:1},{id:'b',value:2}]}];
  const steps=[{elementUpdates:[{primitiveId:'q',elementId:'a',remove:true}]}];
  assert.equal(computePrimitives(initial,steps,0)[0].initialElements.length,1);
  assert.equal(computePrimitives(initial,steps,-1)[0].initialElements.length,2);
  assert.equal(initial[0].initialElements.length,2);
});
