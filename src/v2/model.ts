export type UnitId=1|2|3|4|5|6|7|8;
export type State={unit:UnitId;controls:Record<string,string|boolean|number>};
export type Result={nodes:Record<string,string>;metrics:Record<string,string|number>;summary:string;limit:string};
export const defaults:Record<UnitId,State>={
1:{unit:1,controls:{policy:'private',event:'read'}},
2:{unit:2,controls:{affected:true,reachable:true,kev:false,impact:'high',mitigation:false}},
3:{unit:3,controls:{authorizeBefore:false,serviceScope:'broad'}},
4:{unit:4,controls:{sink:'sql',parameterized:false,safeOutput:false,safePath:false,structuredApi:false}},
5:{unit:5,controls:{separateIdentity:false,dbScope:'admin',segmented:false}},
6:{unit:6,controls:{threat:'disk',diskEncryption:false,secretRevoked:false,artifactVerified:false}},
7:{unit:7,controls:{sast:true,sca:false,secrets:false,negativeTest:false,correlation:false}},
8:{unit:8,controls:{revoke:false,isolate:false,rotate:false,trustedArtifact:false,restore:false}}
};
export function setControl(s:State,key:string,value:string|boolean|number):State{return {...s,controls:{...s.controls,[key]:value}}}
export function evaluate(s:State):Result{const c=s.controls;
if(s.unit===1){const bad=c.event==='edit'||c.event==='outage'||(c.event==='read'&&c.policy!=='public');return{nodes:{document:bad?'bad':'ok',service:c.event==='outage'?'bad':'ok'},metrics:{impact:c.event==='read'?'confidentiality':c.event==='edit'?'integrity':'availability'},summary:bad?'這個事件違反目前的安全目標。':'目前結果符合這個 scope。',limit:'CIA 描述 impact，不等於完整 threat model。'}}
if(s.unit===2){const urgent=!!c.affected&&!!c.reachable&&(!!c.kev||c.impact==='high')&&!c.mitigation;return{nodes:{version:c.affected?'warn':'ok',path:c.reachable?'warn':'blocked',exploit:c.kev?'bad':'unknown'},metrics:{priority:urgent?'優先處理':'補 evidence / 較後處理'},summary:'版本、可達性、利用 evidence、impact 與 mitigation 一起改變判斷。',limit:'這不是 universal risk score。'}}
if(s.unit===3){const safe=!!c.authorizeBefore;return{nodes:{client:'ok',api:safe?'blocked':'warn',resource:safe?'blocked':'bad'},metrics:{dataExposed:safe?0:1},summary:safe?'授權在資料離開前執行。':'拒絕太晚，資料或副作用可能已發生。',limit:'Authentication 不代表 Authorization。'}}
if(s.unit===4){const sink=String(c.sink);const safe=sink==='sql'?!!c.parameterized:sink==='html'?!!c.safeOutput:sink==='path'?!!c.safePath:!!c.structuredApi;return{nodes:{input:'ok',interpreter:safe?'blocked':'bad'},metrics:{interpretation:safe?'data stays data':'structure / destination changed'},summary:safe?'使用這個 context 對應的安全建構方式。':'這個 interpretation boundary 仍可被資料改變。',limit:'不同 context 需要不同 control。'}}
if(s.unit===5){let reach=1;if(!c.separateIdentity)reach+=2;if(c.dbScope==='admin')reach+=2;if(!c.segmented)reach+=2;return{nodes:{api:'bad',worker:c.segmented?'blocked':'warn',db:c.dbScope==='admin'?'bad':'warn'},metrics:{reachableActions:reach},summary:'起點已失守；權限與 network route 決定還能往哪裡走。',limit:'Reachable 不代表 exploit success probability。'}}
if(s.unit===6){const disk=c.threat==='disk';const protectedData=disk&&!!c.diskEncryption;return{nodes:{data:protectedData?'blocked':'bad',secret:c.secretRevoked?'blocked':'warn',artifact:c.artifactVerified?'ok':'warn'},metrics:{dataReadable:protectedData?'no':'yes',leakedCredentialValid:c.secretRevoked?'no':'yes'},summary:disk?'加密可限制遺失磁碟的資料暴露。':'Application compromise 需要另外評估 runtime access。',limit:'Encryption 效果取決於 threat location。'}}
if(s.unit===7){const covered=!!c.negativeTest;return{nodes:{sast:c.sast?'ok':'unknown',sca:c.sca?'ok':'unknown',secrets:c.secrets?'ok':'unknown',tests:covered?'ok':'unknown',runtime:c.correlation?'ok':'unknown'},metrics:{businessLogicCovered:covered?'yes':'no'},summary:covered?'行為 claim 有 negative-test evidence；仍有其他 scope。':'Scanner findings 不能取代 resource-level behavior test。',limit:'No finding does not prove no vulnerability。'}}
const contained=!!c.revoke&&!!c.isolate;const recovered=contained&&!!c.rotate&&!!c.trustedArtifact&&!!c.restore;return{nodes:{credential:c.revoke?'blocked':'bad',service:c.isolate?'blocked':'bad',artifact:c.trustedArtifact?'ok':'unknown',data:c.restore?'ok':'unknown'},metrics:{contained:contained?'yes':'no',trustedRecovery:recovered?'yes':'no'},summary:recovered?'有 bounded evidence 支持恢復可信狀態。':contained?'已限制影響，但恢復未完成。':'仍有 active attack path。',limit:'Rollback、restore、rotation 解決不同問題。'};}
