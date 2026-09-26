import type {Result,Status,Value} from './model';
export const finalDefaults:Record<string,Value>={asset:'customer documents',objective:'read',sharing:'private',resourceCheck:false,safePreview:false,advisoryChecked:false,versionAffected:true,dependencyUsed:true,patched:false,separateWorker:false,workerScope:'all',workerRoute:true,workerRevoked:false,fields:false,interaction:false,bulkRule:false,deployRevoked:false,ciScope:'write',provenance:false,knownArtifact:false,rotate:false,restore:false,restoreVerified:false,isolate:false,resume:false,sast:false,behaviorTest:false,dependencyScan:false,secretScan:false,domain:'collaboration SaaS'};
export const incidents=[
{title:'新 sharing feature',question:'團隊要讓外部協作者看文件預覽。Browser 帶入 document ID 與預覽內容，Worker 也讀檔。哪些結果不應發生？',keys:['asset','objective','sharing','resourceCheck','safePreview','sast','behaviorTest']},
{title:'收到 dependency advisory',question:'建置使用的套件有一則通知，版本和使用路徑尚待核對。前一個 feature 已上線。現在能提出什麼判斷？',keys:['advisoryChecked','versionAffected','dependencyUsed','patched','dependencyScan','behaviorTest']},
{title:'Worker identity 出現不熟悉的使用',question:'先假設 Worker 的工作身分已失守。它能碰到哪些資料和外部能力？原來的分享政策還足夠嗎？',keys:['separateWorker','workerScope','workerRoute','workerRevoked','resourceCheck']},
{title:'大量文件存取訊號',question:'同一時段出現大量讀取。紀錄不完整，可能是合法批次，也可能和之前的身分有關。你能知道誰、在哪裡、做了什麼嗎？',keys:['fields','interaction','bulkRule','isolate','workerRevoked','workerScope']},
{title:'發布憑證外洩，產物來源待核對',question:'公開紀錄出現部署 token，並有一份不熟悉的 artifact。刪原文或還原備份足夠嗎？逐條核對持續能力與恢復依據。',keys:['deployRevoked','ciScope','provenance','knownArtifact','rotate','restore','restoreVerified','isolate','resume','secretScan','behaviorTest']},
{title:'帶到另一個系統',question:'選熟悉的 domain，沿同一張合成架構重新判斷。角色名稱換了，哪些 assumptions 需要重新確認？說明你保護什麼、控制在哪裡、證據與未知範圍。',keys:Object.keys(finalDefaults)}
];
export function evaluateFinal(c:Record<string,Value>,step:number):Result {
  const r:Result={nodes:{},details:{},edges:[],metrics:{},evidence:[],summary:'',limit:'所有事件與路徑都是明示假設的合成情境；不執行 scanner，不估 exploit probability，不代表真實系統設定。'};
  const node=(id:string,status:Status,detail:string)=>{r.nodes[id]=status;r.details[id]=detail;};
  const edge=(from:string,to:string,label:string,status:Status)=>r.edges.push({from,to,label,status});
  const ev=(id:string,source:string,claim:string,observation:string,scope:string)=>r.evidence.push({id,source,claim,observation,scope});
  const workerCompromised=step>=2&&!c.workerRevoked;
  const workerRead=workerCompromised&&c.workerRoute&&c.workerScope!=='none';
  const workerWrite=workerRead&&c.workerScope==='all';
  const providerUse=workerCompromised&&!c.separateWorker&&c.workerRoute;
  const deploymentActive=step>=4&&!c.deployRevoked;
  const badRuntime=step>=4&&!c.knownArtifact;
  const appRead=badRuntime&&!c.isolate;
  const previewChanged=!c.safePreview;
  const requestExposed=c.sharing==='private'&&!c.resourceCheck;
  const versionRisk=step>=1&&c.versionAffected&&c.dependencyUsed&&!c.patched;
  const contained=!workerRead&&!providerUse&&!deploymentActive&&!appRead;
  const ready=step>=4&&contained&&c.provenance&&c.knownArtifact&&c.rotate&&c.restore&&c.restoreVerified;
  node('browser','ok','外部協作者改 document ID，要求另一位擁有者的文件');
  node('api',c.isolate?'blocked':requestExposed?'bad':'ok',c.isolate?'隔離，正常協作也不可用':requestExposed?'私人文件 ID 可跨使用者讀取':c.sharing==='public'?'政策允許公開讀取':'每次讀取先檢查人與文件');
  node('db',requestExposed||workerWrite||appRead?'bad':workerRead?'warn':'ok',workerWrite?'Worker 可讀／改／刪':workerRead?'Worker 可讀；不能改／刪':appRead?'未知 runtime 可讀資料':requestExposed?'API 越界讀取仍在':'目前列出的越界路徑已阻擋');
  node('worker',workerCompromised?'bad':'ok',workerCompromised?'已失守，繼承現有能力':step>=2?'已撤銷失守的工作身分':'合法預覽工作');
  node('storage',workerRead?'bad':previewChanged?'warn':'ok',workerRead?`失守 Worker 能使用 ${c.workerScope} scope`:previewChanged?'外部預覽含安全結構標記，能改變 mock 畫面結構':'固定文字／允許結構的預覽');
  node('provider',providerUse?'bad':'blocked',providerUse?'共用 credential 可發布外部內容':'本 Worker 沒有此發布能力');
  node('repo','ok','合成來源與 lockfile');node('ci',versionRisk?'warn':deploymentActive&&c.ciScope==='write'?'bad':'ok',versionRisk?'受影響版本與使用路徑仍在':deploymentActive&&c.ciScope==='write'?'外洩 identity 可發布替換 artifact':'依目前 scope 建置／讀取');
  node('artifact',c.provenance?'ok':'unknown',c.provenance?'來源與摘要一致；不證明程式沒漏洞':'來源／摘要待核對');
  node('deploy',deploymentActive?'bad':'ok',deploymentActive?'外洩 token 還可部署新 artifact':step>=4?'洩漏 token 已撤銷':'正常交付');
  node('app',c.isolate?'blocked':badRuntime?'bad':'ok',c.resume?(ready?'已符合受限恢復條件':'恢復請求被 evidence gate 擋住'):c.isolate?'隔離中；協作不可用':badRuntime?'目前執行內容可信程度未知':'目前執行已核對的內容');
  node('logs',c.fields&&c.interaction?'ok':'unknown',c.fields?c.interaction?'身分／時間／資源／操作可跨服務關聯':'有事件欄位，跨服務無關聯':'缺身分與資源欄位，不能界定範圍');node('alerts',step>=3&&c.fields&&c.bulkRule?'warn':'unknown',step>=3&&c.fields&&c.bulkRule?'大量存取觸發調查，不證明惡意':'沒有這條路徑的 alert evidence');
  edge('browser','api','跨文件 ID 的要求',c.isolate?'blocked':requestExposed?'bad':'ok');edge('api','db','跨文件 ID 的讀取',c.isolate?'blocked':requestExposed?'bad':c.sharing==='public'?'ok':'blocked');edge('api','worker','背景預覽入口','warn');edge('worker','db','失守身分的 route ＋ scope',workerRead?'bad':'blocked');edge('worker','storage','失守身分對物件的能力',workerRead?'bad':'blocked');edge('worker','provider','失守身分的共用 credential',providerUse?'bad':'blocked');edge('storage','browser','预览解讀',previewChanged?'warn':'ok');edge('repo','ci','dependency／build',versionRisk?'warn':'ok');edge('ci','artifact','產物發布',c.ciScope==='write'?'warn':'blocked');edge('artifact','deploy','核對來源',c.provenance?'ok':'unknown');edge('deploy','app','部署能力',deploymentActive?'bad':'ok');edge('app','db','未知 runtime 的大量資料存取',appRead?'bad':'blocked');edge('app','logs','事件欄位',r.nodes.logs);edge('logs','alerts','規則涵蓋',r.nodes.alerts);
  if(c.sast)ev('sast','課程 Semgrep-like','預覽建構是否有 rule match',previewChanged?'外部值進入 mock 結構，需 triage':'此規則沒有 match','不檢查物件分享政策或 Worker 能力');
  if(c.behaviorTest)ev('test','合成行為 test','外部協作者不應讀私人文件',requestExposed?'FAIL：跨文件 ID 回傳內容':'PASS：此 sharing policy 下的 API 行為','不涵蓋 compromised Worker 或部署 runtime');
  if(step>=1)ev('advisory','Vendor／local evidence','目前部署是否受影響',!c.advisoryChecked?'尚未核對版本及使用路徑':versionRisk?'受影響版本、使用路徑仍存在':'目前已核對條件沒有此 advisory 路徑','有通知不是 local exploit proof；patched 只改此 advisory 範圍');
  if(c.dependencyScan)ev('sca','SCA','版本符合 advisory 條件',c.patched||!c.versionAffected?'此範圍沒有版本 match':'有版本 match','不證明實際使用路徑或資料後果');
  if(step>=3)ev('runtime','Runtime log','大量存取是否能關聯',c.fields&&c.interaction?'可追身分、時間與資源；需查合法批次需求':'缺必要欄位或跨服務關聯','signal 不是惡意確認，也不補回未記錄的歷史');
  if(step>=4&&c.secretScan)ev('secret','Fake secret scan','公開紀錄含示範 token','有 FAKE_DEPLOY_TOKEN match',c.deployRevoked?'舊 token 已撤銷，但部署內容仍需核對':'舊 token 還有效；移除 match 不撤銷副本');
  const selectedNode=c.asset==='deployment capability'?'deploy':c.asset==='service availability'?'app':'db';
  r.details[selectedNode]+=`；正在檢查的目標：${c.objective==='read'?'不越界讀取':c.objective==='write'?'不被未允許的人修改':'必要時可用'}`;
  r.metrics={當前保護:`${c.asset}：${c.objective==='read'?'不允許私人內容越界讀取':c.objective==='write'?'不允許未授權內容改變':'工作時間應可用'}`,失守身分可用操作:workerRead?(workerWrite?'讀／改／刪':'讀取'):'沒有列出的資料操作',外部發布能力:providerUse?'仍有效':'不可用',依賴判斷:step<1?'尚未收到通知':!c.advisoryChecked?'版本及使用路徑未確認':versionRisk?'需處理此路徑':'此 advisory 路徑已排除／修正',資料恢復:c.restore?c.restoreVerified?'完整性與時間點已驗證':'restore 已做，尚未驗證':'未還原／尚待調查',持續路徑:contained?'本輪列出的持續路徑已限制':'仍有持續能力',恢復證據:ready?'符合本輪受限條件':'尚未完整'};
  r.summary='先在圖上指出後果，再以 evidence 支持判斷；保留未知範圍。';return r;
}
