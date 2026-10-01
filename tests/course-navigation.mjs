import assert from 'node:assert/strict';
import {resolveLesson} from '../src/v2/navigation.ts';
import {units} from '../src/v2/course.ts';
// Direct URLs must teach the same changed constraint as the next-stage action.
assert.equal(resolveLesson(units[2],{stage:'2'}).state.controls.path,'batch');
assert.equal(resolveLesson(units[3],{stage:'2'}).state.controls.richText,true);
const transfer=resolveLesson(units[0],{mode:'transfer'});
assert.equal(transfer.index,units[0].stages.length);
assert.equal(transfer.transfer,true);
assert.equal(transfer.state.controls.resource,'案件資料');
const invalid=resolveLesson(units[0],{stage:'999',state:'broken'});
assert.equal(invalid.transfer,true);
assert.equal(invalid.state.controls.resource,'案件資料');
const saved=resolveLesson(units[2],{stage:'2',state:JSON.stringify({path:'worker',action:'read'})});
assert.equal(saved.state.controls.path,'worker','reload retains learner revision');
assert.equal(saved.state.controls.action,'read');
assert.equal(resolveLesson(units[0],{state:JSON.stringify({policy:'invalid',event:'edit'})}).state.controls.policy,'private');
assert.equal(resolveLesson(units[0],{stage:'-1'}).index,0);
console.log('PASS direct constraint, Transfer consistency, invalid URL and saved revision');
