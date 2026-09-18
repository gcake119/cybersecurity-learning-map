import assert from 'node:assert/strict';
import {deepLabs,deepInitial,meetsDeep} from '../src/labs/deep.ts';
import {missionLabs} from '../src/labs/missions.ts';
const solutions={
0:[{}, {entry:true}, {shared:true}],
7:[{}, {fields:true}, {resource:true}],
1:[{}, {decision:'A'}, {decision:'B'}],
3:[{}, {policy:'role'}, {policy:'role',org:true,state:true}],
4:[{}, {param:true}, {param:true,encode:true}],
6:[{}, {shared:true,log:true}, {shared:true,state:true,log:true}],
2:[{log:'old'}, {log:'new'}, {log:'next'}],
5:[{}, {order:'early'}, {transaction:true,after:true}],
8:[{}, {owner:true}, {state:true,side:true}]
};
for(const [id,lab] of Object.entries(deepLabs))for(let round=0;round<3;round++){
 const v={...deepInitial(lab,round),...solutions[id][round]},known=+id===1&&round>0?3:0;
 const o=lab.run(v,round,known);assert.equal(o.signature,lab.cases[round].expected,`unit ${id}, round ${round}`);assert.ok(meetsDeep(+id,round,v,known,o));
}
// Concrete counterexamples: superficially successful fixes must still fail.
const auth=deepLabs[3],late=deepLabs[5],ci=deepLabs[8];
assert.equal(auth.run({...deepInitial(auth,2),policy:'role'},2,0).signature,'leak');
assert.equal(auth.run({...deepInitial(auth,1),policy:'owner'},1,0).signature,'overblock');
assert.equal(late.run({...deepInitial(late,2),transaction:true},2,0).signature,'notified');
assert.equal(ci.run({...deepInitial(ci,2),state:true},2,0).signature,'partial');
assert.equal(deepLabs[4].run({validate:true,param:false,encode:false},0,0).signature,'both');
assert.equal(deepLabs[6].run({single:true},1,0).signature,'unsafe');
assert.equal(deepLabs[1].run({decision:'B'},2,2).signature,'unknown');
const missionFixes=[{asset:'all',owner:true,fields:true,resource:true,priority:'context'},{service:true,state:true,fields:true,redact:true},{env:'target',repair:true,cross:true,effects:true,monitor:true,response:true}];
missionLabs.forEach((lab,i)=>{assert.equal(lab.run(deepInitial(lab,0),0,0).signature,'gap');for(const r of [1,2])assert.equal(lab.run({...deepInitial(lab,r),...missionFixes[i]},r,0).signature,'safe');});
console.log('PASS 27 deep scenarios, 9 mission rounds, authorization/side-effect/coverage counterexamples');
