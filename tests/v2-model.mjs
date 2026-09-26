import assert from 'node:assert/strict';
import {defaults,evaluate,setControl,cleanState} from '../src/v2/model.ts';
import {units} from '../src/v2/course.ts';
import {finalDefaults,incidents,evaluateFinal} from '../src/v2/final-model.ts';
const state=(id,patch={})=>({...defaults[id],controls:{...defaults[id].controls,...patch}});
const result=(id,patch={})=>evaluate(state(id,patch));
let checks=0;
function equal(actual,expected,reason){assert.equal(actual,expected,reason);checks++;}
// Every rendered parameter must change an observable model result in an applicable context.
for(const unit of units){
 const d=defaults[unit.id];
 const allOn=Object.fromEntries(Object.entries(d.controls).map(([k,v])=>[k,typeof v==='boolean'?true:v]));
 const profiles=[{},allOn,{diskEncryption:true},{threat:"app",appEncryption:true,keySeparate:false,minimize:false},{sink:"html",richText:true,safeOutput:false,richPolicy:false},{bReachable:true,bMitigation:false,kev:false},{path:"worker",serviceScope:"unknown",allPaths:false,defaultDeny:false},{...allOn,path:'worker',serviceScope:'unknown',allPaths:false},{...allOn,threat:'app'},...['sql','html','path','process'].map(sink=>({...allOn,sink})),{...allOn,compromised:'worker',separateIdentity:true},...unit.controls.filter(c=>c.options).flatMap(c=>c.options.map(o=>({[c.key]:o.value})))];
 for(const ctl of unit.controls){
   const choices=ctl.type==='toggle'?[false,true]:ctl.options.map(o=>o.value);
   assert(profiles.some(p=>{const s=state(unit.id,p);return choices.some(v=>JSON.stringify(evaluate(s))!==JSON.stringify(evaluate(setControl(s,ctl.key,v))));}),`Unit ${unit.id}: ${ctl.key} has no observable consequence`);checks++;
 }
 equal(JSON.stringify(evaluate(d)),JSON.stringify(evaluate(d)),`Unit ${unit.id} deterministic`);
}
equal(result(1,{policy:'public'}).nodes.document,'ok','public read is not breach');
equal(result(1,{policy:'public',event:'edit',actor:'viewer'}).nodes.document,'bad','public is not write permission');
equal(result(1,{event:'edit',actor:'owner'}).nodes.document,'ok','owner can edit');
equal(result(1,{event:'outage',availability:'maintenance'}).nodes.service,'bad','accepted maintenance still unavailable');
equal(result(2,{affected:false}).metrics.A,'版本不受此 advisory 影響，維持查核');
assert.notEqual(result(2).metrics.A,result(2,{mitigation:true}).metrics.A);checks++;
equal(result(3,{identity:'Alice',owner:'Alice',authorizeBefore:true}).metrics.dataExposed,1,'legitimate read works');
equal(result(3,{authorizeBefore:true}).metrics.dataExposed,0,'unauthorized read stops before side effect');
equal(result(3,{action:'write'}).metrics.writeSideEffect,1,'late denial does not undo write');
equal(result(3,{path:'batch',action:'write',serviceScope:'scoped',authorizeBefore:true}).metrics.writeSideEffect,1,'API control misses batch');
equal(result(3,{path:'batch',action:'write',serviceScope:'scoped',allPaths:true}).metrics.writeSideEffect,0,'resource policy covers batch');
equal(result(3,{identity:'guest'}).metrics.dataExposed,0,'no identity is denied');
for(const [sink,key] of [['sql','parameterized'],['html','safeOutput'],['path','safePath'],['process','structuredApi']]){
 equal(result(4,{sink,[key]:true}).nodes.interpreter,'blocked',sink+' correct control');
 equal(result(4,{sink,input:'normal'}).nodes.interpreter,'ok','ordinary input is not automatically injection');
 for(const unrelated of ['parameterized','safeOutput','safePath','structuredApi'].filter(k=>k!==key))equal(result(4,{sink,[unrelated]:true}).nodes.interpreter,'bad','unrelated control does not protect '+sink);
}
equal(result(4,{input:'invalid',validation:true}).nodes.input,'blocked');
equal(result(4,{validation:true}).nodes.interpreter,'bad','validation accepts legitimate free-form marker');
equal(result(4,{sink:'html',richText:true,safeOutput:true}).nodes.output,'warn','pure text loses rich text functionality');
equal(result(4,{sink:'html',richText:true,richPolicy:true}).nodes.interpreter,'blocked','allowed rich policy protects structure');
equal(result(5,{segmented:true}).nodes.db,'bad','segmentation is not DB authorization');
equal(result(5,{separateIdentity:true,dbScope:'read'}).nodes.db,'warn','read scope still allows read');
equal(result(5,{compromised:'worker',segmented:true}).nodes.db,'blocked','worker route to DB blocked');
equal(result(5,{compromised:'worker',workerNeedsWrite:true,storageScope:'none'}).metrics.正常工作,'所需 thumbnail 寫入被阻擋');
equal(result(6,{diskEncryption:true}).metrics.dataReadable,'no');
equal(result(6,{diskEncryption:true,threat:'app'}).metrics.dataReadable,'yes','disk encryption does not stop app runtime');
equal(result(6,{appEncryption:true,threat:'app'}).metrics.dataReadable,'yes','app can decrypt if key available');
equal(result(6,{appEncryption:true,keySeparate:true,threat:'app'}).metrics.dataReadable,'no');
equal(result(6,{sourceRemoved:true,rotated:true}).metrics.leakedCredentialValid,'yes','rotation and removal do not revoke');
equal(result(6,{secretRevoked:true}).metrics.leakedCredentialValid,'no');
equal(result(7,{negativeTest:true}).nodes.tests,'bad','test finds missing resource policy');
equal(result(7,{negativeTest:true,fixAuth:true,background:true}).nodes.tests,'ok');
equal(result(7,{negativeTest:true,fixAuth:true,background:true}).nodes.background,'unknown','new path is uncovered despite green API test');
equal(result(7,{sast:true,fixQuery:true}).evidence.some(e=>e.id==='query'),false,'rescan removes bounded query match');
equal(result(7,{sast:true,fixQuery:true}).evidence.some(e=>e.id==='fixture'),true,'fixture still matches');
equal(result(7,{sast:true,negativeTest:true,fixAuth:true}).metrics.businessLogicCovered,'no','business refund flaw still uncovered');
equal(result(7,{alert:true}).nodes.alerts,'unknown','rule without fields has no evidence');
equal(result(8,{revoke:true}).metrics.contained,'no','deployed service remains active');
equal(result(8,{restore:true}).nodes.data,'unknown','restore is not verified recovery');
equal(result(8,{rollback:true}).nodes.artifact,'unknown','rollback alone is not artifact trust');
const recovered={revoke:true,reduce:true,rotate:true,trustedArtifact:true,restore:true,verifyRestore:true,resume:true};
equal(result(8,recovered).metrics.trustedRecovery,'yes');
for(const key of ['revoke','reduce','rotate','trustedArtifact','restore','verifyRestore'])equal(result(8,{...recovered,[key]:false}).metrics.trustedRecovery,'no','recovery needs '+key);
// Final is a persistent, cumulative system, not one isolated quiz per unit.
const final=(patch={},step=4)=>evaluateFinal({...finalDefaults,...patch},step);
for(const [key,value] of Object.entries(finalDefaults)){
 const alternatives=typeof value==='boolean'?[false,true]:key==='asset'?['deployment capability']:key==='objective'?['write']:key==='sharing'?['public']:key==='workerScope'?['read','none']:key==='ciScope'?['read']:key==='domain'?[]:[];
 if(!alternatives.length)continue;
 const contexts=[{},Object.fromEntries(Object.entries(finalDefaults).filter(([,v])=>typeof v==='boolean').map(([k])=>[k,true])),{app:false,appEncryption:true}];
 assert(contexts.some(p=>alternatives.some(v=>JSON.stringify(final(p))!==JSON.stringify(final({...p,[key]:v})))),'Final parameter '+key);checks++;
}
equal(final({},0).nodes.worker,'ok');equal(final({},2).nodes.worker,'bad');equal(final({workerRevoked:true}).nodes.worker,'ok');
equal(final({resourceCheck:true}).nodes.db,'bad','API policy cannot contain lost worker/runtime');
equal(final({deployRevoked:true}).nodes.app,'bad','revoking deploy does not stop executing artifact');
equal(final({provenance:true}).nodes.artifact,'ok');equal(final({provenance:true}).nodes.app,'bad','provenance does not restore runtime');
const finalRecovery={workerRevoked:true,deployRevoked:true,isolate:true,provenance:true,knownArtifact:true,rotate:true,restore:true,restoreVerified:true,resume:true};
equal(final(finalRecovery).metrics.恢復證據,'符合本輪受限條件');
for(const key of ['workerRevoked','deployRevoked','provenance','knownArtifact','rotate','restore','restoreVerified']){
 // known artifact affects active runtime independently of isolated service.
 if(key==='workerRevoked')equal(final({...finalRecovery,workerRevoked:false,isolate:true}).metrics.恢復證據,'尚未完整');
 else equal(final({...finalRecovery,[key]:false}).metrics.恢復證據,'尚未完整');
}
equal(incidents.length,6);assert.deepEqual(cleanState(1,{event:42,unknown:true}).controls,defaults[1].controls);checks++;
console.log(`PASS ${checks} v2 model assertions; all important parameters, applicable contexts, cross-control limitations and integrated incidents`);
