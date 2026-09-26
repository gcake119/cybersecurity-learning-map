import assert from 'node:assert/strict';
import {defaults,evaluate,setControl} from '../src/v2/model.ts';
function changed(unit,key,value,metric){const a=evaluate(defaults[unit]);const b=evaluate(setControl(defaults[unit],key,value));assert.notDeepEqual(a[metric]??a,b[metric]??b,'unit '+unit+' should change consequence');}
changed(1,'policy','public','summary');
changed(2,'mitigation',true,'metrics');
changed(3,'authorizeBefore',true,'metrics');
let u4=setControl(defaults[4],'parameterized',true);assert.equal(evaluate(u4).nodes.interpreter,'blocked');
changed(5,'segmented',true,'metrics');
changed(6,'diskEncryption',true,'metrics');
changed(7,'negativeTest',true,'metrics');
let u8=defaults[8];for(const k of ['revoke','isolate','rotate','trustedArtifact','restore'])u8=setControl(u8,k,true);assert.equal(evaluate(u8).metrics.trustedRecovery,'yes');
assert.equal(evaluate(defaults[7]).metrics.businessLogicCovered,'no','scanner alone must not claim business logic coverage');
console.log('v2 model tests passed');