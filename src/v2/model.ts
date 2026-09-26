export type UnitId = 1|2|3|4|5|6|7|8;
export type Value = string|boolean|number;
export type State = {unit:UnitId; controls:Record<string,Value>};
export type Status = 'ok'|'bad'|'warn'|'blocked'|'unknown';
export type Edge = {from:string;to:string;label:string;status:Status};
export type Evidence = {id:string;source:string;claim:string;observation:string;scope:string};
export type Result = {nodes:Record<string,Status>; details:Record<string,string>; edges:Edge[]; metrics:Record<string,string|number>; evidence:Evidence[]; summary:string; limit:string};
export const defaults:Record<UnitId,State> = {
  1:{unit:1,controls:{policy:'private',event:'read',actor:'stranger',resource:'文件內容',allowedAction:'read',availability:'required',claim0:'unknown',claim1:'unknown',claim2:'unknown',claim3:'unknown',claim4:'unknown'}},
  2:{unit:2,controls:{affected:true,reachable:true,kev:false,impact:'high',mitigation:false,bAffected:true,bReachable:false,bImpact:'low',bMitigation:false,cve:false,cvss:false,epss:false,kevCard:false,vendor:false,inventory:false}},
  3:{unit:3,controls:{identity:'Alice',owner:'Bob',action:'read',authorizeBefore:false,serviceScope:'broad',defaultDeny:false,path:'api',allPaths:false}},
  4:{unit:4,controls:{input:'marker',sink:'sql',validation:false,parameterized:false,safeOutput:false,safePath:false,structuredApi:false,richText:false,richPolicy:false}},
  5:{unit:5,controls:{compromised:'api',separateIdentity:false,dbScope:'admin',storageScope:'all',segmented:false,workerNeedsWrite:false}},
  6:{unit:6,controls:{threat:'disk',diskEncryption:false,appEncryption:false,keySeparate:false,minimize:false,sourceRemoved:false,secretScope:'all',sharedSecret:true,rotated:false,consumerUpdated:false,secretRevoked:false,dependency:'unknown',ciPermission:'write',artifactVerified:false,artifactSource:'unreviewed'}},
  7:{unit:7,controls:{ai:false,sast:true,sca:false,secrets:false,negativeTest:false,fixQuery:false,fixAuth:false,fixSecret:false,patchDependency:false,triage:'pending',background:false,event:'bulk',logFields:false,correlation:false,alert:false}},
  8:{unit:8,controls:{identityEvidence:false,resourceEvidence:false,timeEvidence:false,revoke:false,isolate:false,reduce:false,rotate:false,trustedArtifact:false,rollback:false,restore:false,verifyRestore:false,resume:false,regression:false,detection:false,permissionChange:false,threatUpdate:false}}
};
export function setControl(s:State,key:string,value:Value):State { return {...s,controls:{...s.controls,[key]:value}}; }
export function cleanState(unit:UnitId,raw:unknown):State {
  const state=structuredClone(defaults[unit]);
  if(raw && typeof raw==='object') for(const [key,value] of Object.entries(raw)) {
    const original=state.controls[key];
    if(original!==undefined && typeof value===typeof original && (typeof value!=='number'||Number.isFinite(value))) state.controls[key]=value as Value;
  }
  return state;
}
export function evaluate(s:State):Result {
  const c=s.controls;
  const r:Result={nodes:{},details:{},edges:[],metrics:{},evidence:[],summary:'',limit:''};
  const node=(id:string,status:Status,detail:string)=>{r.nodes[id]=status;r.details[id]=detail;};
  const edge=(from:string,to:string,label:string,status:Status)=>r.edges.push({from,to,label,status});
  const ev=(id:string,source:string,claim:string,observation:string,scope:string)=>r.evidence.push({id,source,claim,observation,scope});
  if(s.unit===1) {
    const allowedRead=c.policy==='public'||c.actor==='owner'||c.actor==='viewer';
    const allowedEdit=c.actor==='owner';
    const violation=c.event==='read'?!allowedRead:c.event==='edit'?!allowedEdit:c.availability==='required';
    node('actor','ok',String(c.actor));node('document',c.event!=='outage'&&violation?'bad':'ok',c.event==='read'?(allowedRead?'依政策可讀':'未允許的人取得內容'):c.event==='edit'?(allowedEdit?'擁有者修改':'內容被未允許的人修改'):'內容未改');
    node('service',c.event==='outage'?'bad':'ok',c.event==='outage'?'服務停止，無法讀取':'合法使用者可使用');
    edge('actor','document',c.event==='edit'?'修改內容':'讀取內容',c.event!=='outage'&&violation?'bad':'ok');edge('document','service','需要時取得',c.event==='outage'?'blocked':'ok');
    r.metrics={結果:violation?'違反目前要求':'此 scope 沒有違反要求',候選目標句:`${c.actor} 對${c.resource}${c.allowedAction==='read'?'只允許讀取':'允許修改'}；${c.availability==='required'?'工作時必須可用':'已接受維護中斷'}`};
    r.summary='觀察文件與服務，政策和角色會改變同一事件的後果。';r.limit='候選目標句用來整理需求，不會自動改寫既有角色政策，需要核對兩者是否一致。公開只改變讀取政策，不會自動允許修改；CIA 是描述損害的語言，不是完整威脅模型。';
    const claims=['陌生人不能讀私人文件','必須使用 MFA','所有文件都受法規保護','Viewer 不能改文件','工作時間能取得文件'];
    const kinds=['confirmed','solution','assumption','confirmed','confirmed'];
    claims.forEach((text,i)=>{const group=String(c['claim'+i]);ev('claim'+i,'Agent 提案',text,group==='unknown'?'尚未歸類':group==='confirmed'?'放入需求':group==='assumption'?'放入待確認條件':'放入做法',group==='unknown'?'請建立需求、假設與做法的關係':group===kinds[i]?'與目前情境一致':`需重新檢查：${i===1?'這是做法，尚未說明要保護的結果':i===2?'情境沒有提供法規依據':'目前政策已支持這項要求'}`);});
  } else if(s.unit===2) {
    const rationale=(affected:Value,reachable:Value,impact:Value,mitigation:Value)=>!affected?'版本不受此 advisory 影響，維持查核':!reachable?'此路徑不可達；仍需查內部入口':mitigation?'目前路徑有緩解；確認有效性及到期日':c.kev||impact==='high'?'優先處理：可達且後果重要／已有利用紀錄':'補查利用条件及業務後果';
    node('serviceA',c.affected&&c.reachable&&!c.mitigation?'bad':'warn',rationale(c.affected,c.reachable,c.impact,c.mitigation));node('serviceB',c.bAffected&&c.bReachable&&!c.bMitigation?'bad':'warn',rationale(c.bAffected,c.bReachable,c.bImpact,c.bMitigation));node('advisory','warn','A／B 的 synthetic 技術嚴重度相同');
    edge('advisory','serviceA','版本＋部署資料',c.affected?'warn':'blocked');edge('advisory','serviceB','版本＋部署資料',c.bAffected?'warn':'blocked');
    r.metrics={A:r.details.serviceA,B:r.details.serviceB,當地風險:'不產生分數或入侵機率'};
    for(const [key,source,claim,obs,scope] of [
      ['cve','CVE','識別同一公開漏洞','DEMO-CVE-001（虛構 ID）','不證明本機版本受影響'],['cvss','CVSS','描述技術嚴重度','兩服務描述相同','不是當地風險排序'],['epss','EPSS','公開 CVE 未來 30 天利用活動估計','教學資料：5％','不是你的 server 被入侵的機率'],['kevCard','KEV','是否有確認利用歷史',c.kev?'此情境有確認紀錄':'此情境沒有提供紀錄','未列入不代表安全'],['vendor','Vendor advisory','產品與受影響版本條件','示範受影響版本：1.x','不能替代本機 inventory'],['inventory','Local inventory','實際部署版本與可達路徑',`A 受影響：${c.affected}；B 受影響：${c.bAffected}`,'只是目前設定快照']]) if(c[key])ev(key,source,claim,obs,scope);
    r.summary='同一 advisory，部署事實不同，處理理由就不同。';r.limit='未對 Internet 開放不等於所有內部路徑不可達；mitigation 只代表此情境假設已驗證的緩解。';
  } else if(s.unit===3) {
    const service=c.path!=='api';
    const authenticated=c.identity!=='guest';
    const allowed=service?c.serviceScope==='broad'||(c.action==='read'&&c.owner==='Alice'):authenticated&&c.identity===c.owner;
    const enforced=c.allPaths||(!service&&c.authorizeBefore);
    const denied=!authenticated&&!service||(!allowed&&enforced)||(service&&c.serviceScope==='unknown'&&c.defaultDeny);
    const exposed=!denied && c.action==='read';const written=!denied&&c.action==='write';
    node('client',authenticated||service?'ok':'unknown',service?`${c.path} 提出要求`:`身分：${c.identity}`);node('api',denied?'blocked':allowed?'ok':'warn',denied?'資料操作前拒絕':allowed?'政策允許':'此入口沒有及時檢查');node('resource',!allowed&&!denied?'bad':denied?'blocked':'ok',written?'寫入已發生':exposed?'內容已離開資源':'無讀取或寫入副作用');
    edge('client','api','跨入口；重新判斷',denied?'blocked':'warn');edge('api','resource',String(c.action),denied?'blocked':allowed?'ok':'bad');
    r.metrics={政策是否允許:allowed?'是':'否',dataExposed:exposed?1:0,writeSideEffect:written?1:0,回應:denied?'拒絕':allowed?'允許':'事後拒絕，副作用仍存在'};
    r.summary='追蹤真正讀取／寫入的位置，而不只看最後回應。';r.limit='假設 API、Worker、batch 是三個入口；集中資源政策才涵蓋所有入口。內網位置不提供額外權限。';
  } else if(s.unit===4) {
    const sink=String(c.sink);const controlled=sink==='sql'?c.parameterized:sink==='html'?c.safeOutput:sink==='path'?c.safePath:c.structuredApi;
    const marker=c.input==='marker';const rejected=c.input==='invalid'&&c.validation;
    const changed=marker&&!controlled&&!rejected;
    const rich=sink==='html'&&c.richText;
    const functional=!rich||!!c.richPolicy||!c.safeOutput;
    const protectedRich=rich&&c.richPolicy;
    node('input',rejected?'blocked':'ok',c.input==='normal'?'一般文字':c.input==='invalid'?'不符合業務型別':'安全的 STRUCTURE_MARKER（非真實 payload）');
    node('interpreter',rejected||((controlled||protectedRich)&&marker)?'blocked':changed&&!protectedRich?'bad':'ok',rejected?'型別不接受；未送入解讀器':changed&&!protectedRich?'資料改變結構／目的地':'資料維持資料，結構固定');
    node('output',functional?'ok':'warn',rich?(functional?'保留允許的 rich text 元素':'純文字安全，但 rich text 功能消失'):sink==='sql'?(changed?'query 結構變動':'固定 query ＋值'):sink==='path'?(changed?'目的地超出指定根目錄':'目的地位於指定根目錄'):sink==='process'?(changed?'operation 結構變動':'固定 operation ＋arguments'):'文字輸出');
    edge('input','interpreter',sink,rejected?'blocked':changed&&!protectedRich?'bad':'ok');edge('interpreter','output','產生結果',r.nodes.interpreter);
    r.metrics={interpretation:r.details.interpreter,功能需求:functional?'符合':'不符合：只輸出純文字'};r.summary='同一份資料換下一站，就需要重新检查如何建構。';r.limit='只使用安全標記示範結構，不執行 SQL、HTML 或 command；業務型別驗證不會讓合法自由文字自動適用所有解讀器。';
  } else if(s.unit===5) {
    const origin=String(c.compromised);const workerReach=origin==='worker'||!c.segmented;const dbReach=origin==='api'||!c.segmented;
    const dbAdmin=!c.separateIdentity||c.dbScope==='admin';const storage=workerReach&&c.storageScope!=='none';
    const actions:string[]=[`${origin}：控制現有程序`];if(dbReach)actions.push('DB：讀取',...(dbAdmin?['DB：修改','DB：刪除']:[]));if(storage)actions.push('Storage：讀取',...(c.storageScope==='all'||c.storageScope==='write'?['Storage：寫入']:[]),...(c.storageScope==='all'?['Storage：刪除']:[]));if(workerReach&&!c.separateIdentity)actions.push('Provider：使用共用 credential');
    node('api',origin==='api'?'bad':dbReach?'warn':'blocked',origin==='api'?'已失守的起點':'是否可達 API 路徑');node('worker',origin==='worker'?'bad':workerReach?'warn':'blocked',workerReach?'目前 route 可達':'network route 已阻擋');node('db',!dbReach?'blocked':dbAdmin?'bad':'warn',!dbReach?'沒有 network route':dbAdmin?'現有 identity 可讀／改／刪':'現有 identity 只能讀');node('storage',storage?'warn':'blocked',storage?`可用 scope：${c.storageScope}`:'不能取得儲存物件');node('provider',workerReach&&!c.separateIdentity?'bad':'blocked',c.separateIdentity?'此 identity 沒有 provider credential':'共用 credential 可使用 provider');
    edge('api','worker','network route',workerReach?'warn':'blocked');edge(origin,'db','route ＋ credential ＋ scope',r.nodes.db);edge('worker','storage','物件權限',r.nodes.storage);edge('worker','provider','credential',r.nodes.provider);
    r.metrics={reachableActions:actions.length,可執行操作:actions.join('；'),正常工作:c.workerNeedsWrite?storage&&(c.storageScope==='write'||c.storageScope==='all')?'可產生 thumbnail':'所需 thumbnail 寫入被阻擋':'本輪只需讀取'};r.summary='起點已失守；移除一條路徑或權限會縮小它現有的能力。';r.limit='共用 identity 在此模型繼承 DB admin；分離後才使用指定 DB scope。分段只改路徑，不會把 DB admin 改為只讀。可達不代表實際利用成功。';
  } else if(s.unit===6) {
    const disk=c.threat==='disk';const readable=!c.minimize&&!(disk&&(c.diskEncryption||c.appEncryption))&&!(c.appEncryption&&c.keySeparate);
    node('data',readable?'bad':'blocked',c.minimize?'沒有保存此敏感欄位':readable?'此位置能讀到明文':'此 threat 位置無法取得明文');node('key',c.keySeparate?'blocked':'warn',c.keySeparate?'key 與應用分離，且此 identity 不可呼叫解密':'app 可取得 key／呼叫解密');node('secret',c.secretRevoked?'blocked':'bad',c.secretRevoked?'洩漏的舊 credential 已無效':c.sourceRemoved?'原文已刪，副本仍有效':'公開副本可繼續使用');node('consumer',c.rotated&&!c.consumerUpdated?'bad':'ok',c.rotated?c.consumerUpdated?'consumer 使用新 credential':'consumer 尚未切換；服務失敗':'consumer 使用原 credential');node('dependency',c.dependency==='patched'?'ok':'unknown',c.dependency==='advisory'?'advisory 需版本、usage 與路徑調查':c.dependency==='patched'?'已換版；需要相容性與使用路徑驗證':'來源／版本仍待查');node('ci',c.ciPermission==='write'?'warn':'blocked',c.ciPermission==='write'?'CI identity 能發布替換產物':'CI 只有讀取權限，不能發布');node('artifact',c.artifactVerified?'ok':'unknown',c.artifactVerified?'來源與摘要匹配；不是無漏洞證明':'部署產物来源尚未核對');
    edge('key','data','解密能力',readable?'warn':'blocked');edge('secret','consumer',c.sharedSecret?'多個 consumer 共用':'此 consumer 專用',c.secretRevoked?'blocked':'bad');edge('dependency','ci','納入 build',r.nodes.dependency);edge('ci','artifact','發布能力',r.nodes.ci);
    r.metrics={dataReadable:readable?'yes':'no',leakedCredentialValid:c.secretRevoked?'no':'yes',洩漏可用範圍:c.secretRevoked?'無':c.secretScope==='all'?(c.sharedSecret?'多服務讀寫與部署':'單服務讀寫與部署'):'指定發布操作',產物內容:c.artifactSource==='reviewed'?'來源已 review，仍需 security verification':'来源內容尚未 review'};
    r.summary='保護資料、撤銷能力與核對產物是不同工作。';r.limit='key 分離只有在 compromised app 也無法取得 key 或呼叫解密時有效；此假設在圖上明示。Provenance 不能證明來源程式安全。';
  } else if(s.unit===7) {
    node('code',c.fixQuery&&c.fixAuth&&c.fixSecret?'ok':'warn','含 query、物件權限、fake secret、dependency、業務流程五個觀察目標');
    node('sast',c.sast?'warn':'unknown',c.sast?c.fixQuery?'本規則無 unsafe-query match；fixture 仍 match':'unsafe-query 與 test fixture 都 match':'未執行');node('tests',c.negativeTest?c.fixAuth?'ok':'bad':'unknown',c.negativeTest?c.fixAuth?'API 越權修改被阻擋，資料未變':'API 越權修改成功，資料被改':'沒有行為 evidence');node('background',c.background?'unknown':'blocked',c.background?'新增 job 沒有在 API 測試範圍':'本輪沒有新增 job');node('logs',c.logFields&&c.correlation?'ok':'unknown',c.logFields?c.correlation?'時間、入口、身分、操作＋同一 interaction ID':'有事件欄位，跨服務還無法關聯':'無法回答誰、何時、在哪裡、做了什麼');node('alerts',c.alert&&c.logFields?'warn':'unknown',c.alert&&c.logFields?`對 ${c.event} 產生需調查的訊號`:'沒有此事件的可用偵測 evidence');
    edge('code','sast','課程 synthetic 規則',c.sast?'warn':'unknown');edge('code','tests','API 物件行為',r.nodes.tests);edge('code','background','新增入口',r.nodes.background);edge('logs','alerts','欄位 ＋ alert rule',r.nodes.alerts);
    if(c.ai)ev('ai','AI Review','可能存在物件權限缺口','Agent 提出未核實 claim','需要追 code path 及行為 evidence');
    if(c.sast){if(!c.fixQuery)ev('query','Semgrep-like rule: demo-unsafe-query','query 建構可被外部值改變','match：query = STRUCTURE + externalValue；來源為 request，進 mock DB','調查後符合此教學缺陷；不是 production exploit proof');ev('fixture','Semgrep-like rule: demo-unsafe-query','相似字串建構是否有風險？','match：fixture = STRUCTURE + fixedExample；僅在測試文字中，沒有 DB sink',c.triage==='nonApplicable'?'已調查：non-applicable／FP-style；保留理由，不改 fixture':'待 triage：inspect source、sink 及可達性');}
    if(c.sca)ev('dependency','SCA','此版本是否符合 advisory',c.patchDependency?'已換到此 advisory 不受影響版本':'synthetic package 1.x 符合受影響範圍','不證明此 app 可被利用');
    if(c.secrets)ev('secret','Secret Scan','是否有符合 fake credential pattern 的字串',c.fixSecret?'本掃描範圍不再 match':'FAKE_DEMO_TOKEN match','移除原文不代表已撤銷洩漏副本');
    ev('business','一般 pattern scanner','同一帳號可否重複兌換退款？','本 synthetic scanner 未提供規則；缺陷仍存在','scanner 沒 finding；需要額外業務 invariant test');
    if(c.negativeTest)ev('test','Security test','Alice 不可改 Bob 文件，且內容不變',c.fixAuth?'PASS：403 ＋ DB unchanged':'FAIL：DB changed','只涵蓋 API，未涵蓋新增 job，也未測退款 invariant');
    r.metrics={businessLogicCovered:'no',資源權限證據:c.negativeTest?'API 行為已執行檢查':'尚未執行',新增路徑覆蓋:c.background?'未涵蓋；API 綠燈不擴大 claim':'沒有新增路徑',runtimeEvidence:c.logFields&&c.correlation?'可關聯':'不完整'};
    r.summary='每個結果只支持自己的 claim 與 scope。';r.limit='這是課程模擬，不執行真實 Semgrep。真實 Semgrep 的規則、engine、設定及掃描範圍決定行為；本課的固定 match 表不能預測真實結果。';
  } else {
    const activeDeploy=!c.revoke;const activeData=!c.isolate&&!c.reduce;
    const contained=!activeDeploy&&!activeData;const dataTrusted=c.restore&&c.verifyRestore;const ready=contained&&c.rotate&&c.trustedArtifact&&dataTrusted;
    node('credential',activeDeploy?'bad':'blocked',(activeDeploy?'舊 credential 還能發出部署要求':'舊 credential 已撤銷')+'；'+(c.identityEvidence?'有身分使用紀錄':'尚未知使用身分'));node('service',c.isolate?'blocked':activeData?'bad':'warn',c.isolate?'隔離；合法使用者也不能用':activeData?'未知產物仍可大量讀資料':'資料路徑已縮限');node('artifact',c.trustedArtifact?'ok':'unknown',c.trustedArtifact?'核對可信來源後重新部署':c.rollback?'code rollback；仍待核對產物來源':'部署內容可信程度未知');node('data',dataTrusted?'ok':'unknown',dataTrusted?'restore 後 integrity／freshness check 通過':c.restore?'有 restore，尚未驗證內容及時間點':'是否被修改仍待調查');node('downstream',c.rotate?'ok':'bad',c.rotate?'下游 consumer 已換新秘密並撤銷舊副本':'洩漏下游秘密可能仍有效');
    edge('credential','artifact','建立部署',activeDeploy?'bad':'blocked');edge('artifact','service','執行產物',c.trustedArtifact?'ok':'warn');edge('service','data','大量存取',activeData?'bad':'blocked');edge('service','downstream','下游能力',c.rotate?'blocked':'bad');
    r.metrics={contained:contained?'yes':'no',trustedRecovery:ready?'yes':'no',服務可用:c.resume&&ready?'可恢復（受限權限）':c.isolate?'隔離中':c.resume?'恢復請求被 gate 擋住':'尚未確認可恢復',已知範圍:[c.identityEvidence?'identity 已知':'identity 未知',c.resourceEvidence?'resource 已知':'resource 未知',c.timeEvidence?'time window 已知':'time window 未知'].join('；'),後續改善:['regression','detection','permissionChange','threatUpdate'].filter(k=>c[k]).length+'／4 項已加入（不是事件分數）'};
    [['t0','credential use',c.identityEvidence],['t1','deployment／API',c.timeEvidence],['t2','data access',c.resourceEvidence],['t3','log／alert',c.identityEvidence&&c.timeEvidence&&c.resourceEvidence]].forEach(([id,event,known])=>ev(String(id),'incident timeline',String(event),known?'有此範圍的教學 evidence':'尚未取得此 evidence','只有可見的 identity／resource／time evidence；不推論完整 incident'));r.summary=ready?'可信恢復的必要條件已各自驗證。':contained?'持續路徑已限制；逐項核對恢復 evidence。':'仍有持續能力，追圖上的 active path。';r.limit='restore 不撤銷 credential；rollback 不修复 data；隔離有可用性代價。此模型只驗證列出的受限恢復條件，不宣稱全面安全。';
  }
  return r;
}
