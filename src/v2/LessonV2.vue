<script setup lang="ts">
import {computed,ref,watch,nextTick} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {bySlug,units} from './course';
import {defaults,evaluate,setControl,cleanState,type State,type Value} from './model';
import ControlsV2 from './ControlsV2.vue';
import SystemGraph from './SystemGraph.vue';
const route=useRoute(),router=useRouter();
const unit=computed(()=>bySlug[String(route.params.slug)]||units[0]);
const transfer=computed(()=>route.query.mode==='transfer');
const index=computed(()=>Math.min(unit.value.stages.length,Math.max(0,Math.trunc(Number(route.query.stage))||0)));
const stage=computed(()=>unit.value.stages[Math.min(index.value,unit.value.stages.length-1)]);
const state=ref<State>(structuredClone(defaults[1]));
const before=ref<State>(structuredClone(defaults[1]));
const compare=ref(false),revealed=ref(false),pulse=ref(0),lastChange=ref('先觀察節點，再改一個條件。');
const result=computed(()=>evaluate(state.value));
const beforeResult=computed(()=>evaluate(before.value));
const focusNodes:Record<number,string[][]>={6:[['data','key'],['secret','consumer'],['dependency','ci','artifact'],['secret','consumer']],7:[['code','sast','tests'],['code','sast','tests'],['logs','alerts'],['code','tests','background']]};
const focusMetrics:Record<number,string[][]>={6:[['dataReadable'],['leakedCredentialValid','洩漏可用範圍'],['產物內容'],['leakedCredentialValid','洩漏可用範圍']],7:[['businessLogicCovered','資源權限證據'],['businessLogicCovered','資源權限證據'],['runtimeEvidence'],['新增路徑覆蓋','資源權限證據']]};
function focused(r:ReturnType<typeof evaluate>){
  if(transfer.value||!focusNodes[unit.value.id])return r;
  const ids=focusNodes[unit.value.id][index.value]||Object.keys(r.nodes);
  const keys=focusMetrics[unit.value.id][index.value]||Object.keys(r.metrics);
  return {...r,nodes:Object.fromEntries(Object.entries(r.nodes).filter(([k])=>ids.includes(k))),edges:r.edges.filter(e=>ids.includes(e.from)&&ids.includes(e.to)),metrics:Object.fromEntries(Object.entries(r.metrics).filter(([k])=>keys.includes(k)))};
}
const visibleResult=computed(()=>focused(result.value));
const visibleBefore=computed(()=>focused(beforeResult.value));
const claimGroups=[{key:'confirmed',name:'需求結果',relation:'保護的結果，仍需回到目前 scope'},{key:'assumption',name:'待確認條件',relation:'沒有業務 evidence 前，不當作事实'},{key:'solution',name:'做法',relation:'還需要連回要保護的結果'},{key:'unknown',name:'尚未歸類',relation:'試著放到有依據的關係'}];
function dropClaim(event:DragEvent,key:string){const id=event.dataTransfer?.getData('text/plain');if(id&&/^claim[0-4]$/.test(id))void change(id,key);}
function dragClaim(event:DragEvent,id:string){event.dataTransfer?.setData('text/plain',id);}
const controls=computed(()=>unit.value.controls.filter(c=>transfer.value||stage.value.keys.includes(c.key)));
function read(){let raw:unknown;try{raw=JSON.parse(String(route.query.state||'null'));}catch{raw=null;}
state.value=cleanState(unit.value.id,raw);}
watch(()=>route.fullPath,read,{immediate:true});
watch(()=>String(route.params.slug),()=>{before.value=structuredClone(defaults[unit.value.id]);compare.value=false;revealed.value=false;lastChange.value='先觀察節點，再改一個條件。';});
function write(controls:Record<string,Value>,extra:Record<string,string|undefined>={}){return router.replace({path:route.path,query:{...route.query,state:JSON.stringify(controls),...extra}});}
async function change(key:string,value:Value){state.value=setControl(state.value,key,value);lastChange.value=`已改變「${unit.value.controls.find(c=>c.key===key)?.label||key}」。觀察節點旁的結果與路徑。`;pulse.value++;await write(state.value.controls);}
async function go(n:number){
  revealed.value=false;
  const isTransfer=n===unit.value.stages.length;
  const seen=String(route.query.seen||'0').split(',');
  let current={...state.value.controls};
  if(transfer.value&&!isTransfer){try{current=cleanState(unit.value.id,JSON.parse(String(route.query.teaching||'null'))).controls;}catch{current={...defaults[unit.value.id].controls};}}
  if(isTransfer){try{current=route.query.transferState?cleanState(unit.value.id,JSON.parse(String(route.query.transferState))).controls:{...defaults[unit.value.id].controls,...unit.value.transferPatch};}catch{current={...defaults[unit.value.id].controls,...unit.value.transferPatch};}}
  else if(!seen.includes(String(n)))current={...current,...unit.value.stages[n]?.patch};
  await router.push({path:route.path,query:{...route.query,stage:String(n),mode:isTransfer?'transfer':undefined,state:JSON.stringify(current),seen:[...new Set([...seen,String(n)])].join(','),teaching:isTransfer&&!transfer.value?JSON.stringify(state.value.controls):route.query.teaching,transferState:transfer.value?JSON.stringify(state.value.controls):route.query.transferState}});
  pulse.value++;await nextTick();document.querySelector<HTMLElement>('.v2-stage-title')?.focus();
}
async function restart(){compare.value=false;revealed.value=false;await router.replace({path:route.path,query:{}});before.value=structuredClone(defaults[unit.value.id]);pulse.value++;}
async function reset(){const initial=transfer.value?{...defaults[unit.value.id].controls,...unit.value.transferPatch}:{...defaults[unit.value.id].controls,...stage.value.patch};await write(initial);pulse.value++;lastChange.value='本階段條件已重設。';}
function snapshot(){before.value={unit:state.value.unit,controls:{...state.value.controls}};compare.value=true;lastChange.value='已保留目前狀態。接著改條件，節點會標出原本結果。';}
</script>
<template><section class="v2-lesson">
<nav class="v2-top" aria-label="課程導覽"><RouterLink to="/v2">← 課程入口</RouterLink><span v-if="!transfer">UNIT {{unit.id}} · {{unit.teaching}}</span><span v-else>新情境 · {{unit.transfer}}</span><RouterLink to="/v2/final">整合情境 →</RouterLink></nav>
<p class="v2-kicker">{{transfer?'TRANSFER':'AI-ASSISTED SECURITY ENGINEERING'}} · {{index+1}}／{{unit.stages.length+1}}</p>
<h1 class="v2-stage-title" tabindex="-1">{{transfer?'換一個情境，重新推演':stage.title}}</h1>
<p class="v2-question">{{transfer?unit.transferPrompt:stage.question}}</p>
<p class="v2-synthetic">課程模擬：結果只依明示設定決定，不執行真實攻擊或 scanner。展開「模型假設」可查範圍。</p>
<nav class="v2-stages" aria-label="學習階段"><button v-for="(s,i) in unit.stages" :key="s.title" :aria-current="index===i?'step':undefined" @click="go(i)">{{i+1}}. {{s.title}}</button><button :aria-current="transfer?'step':undefined" @click="go(unit.stages.length)">Transfer</button></nav>
<div class="v2-toolbar"><button @click="snapshot">保留比較起點</button><button v-if="compare" @click="compare=false">關閉比較</button><button @click="pulse++">重播路徑</button><button @click="reset">重設本階段</button><button @click="restart">從本單元重新開始</button></div>
<p class="v2-change" role="status">{{lastChange}}</p>
<div class="v2-workbench"><section class="v2-control-panel"><h2>{{transfer?'改變系統事實':'試著改一個條件'}}</h2><ControlsV2 :controls="controls" :values="state.controls" @change="change"/></section>
<section class="v2-canvas"><h2>追蹤改變發生在哪裡</h2><SystemGraph :result="visibleResult" :labels="transfer?unit.transferNodes:undefined" :pulse="pulse" :before="compare?visibleBefore:undefined"/><dl class="v2-metrics"><template v-for="(v,k) in visibleResult.metrics" :key="k"><dt>{{k}}</dt><dd>{{v}}</dd></template></dl><p v-if="!transfer" class="v2-summary">{{result.summary}}</p></section></div>
<section v-if="unit.id===1&&index===2&&!transfer" class="v2-claim-board" aria-label="Agent 提案與依據關係"><p>可拖曳提案，或使用上方選單操作；兩者改變同一份關係圖。</p><div class="v2-claim-groups"><section v-for="group in claimGroups" :key="group.key" :data-claim-group="group.key" @dragover.prevent @drop.prevent="dropClaim($event,group.key)"><h2>{{group.name}}</h2><small>{{group.relation}}</small><p v-for="e in result.evidence.filter(e=>state.controls[e.id]===group.key)" :key="e.id" :data-claim="e.id" draggable="true" @dragstart="dragClaim($event,e.id)">{{e.claim}}</p></section></div></section>
<section v-if="transfer||stage.evidence" class="v2-evidence"><h2>檢查依據和範圍</h2><p v-if="unit.id===7" class="v2-synthetic">課程模擬：固定 Semgrep-like 規則／結果，不執行真實 Semgrep。</p><div v-for="e in result.evidence" :key="e.id" class="v2-evidence-row" :data-evidence="e.id"><strong>{{e.source}} · {{e.claim}}</strong><p>{{e.observation}}</p><small>{{e.scope}}</small></div></section>
<section v-if="unit.id===7&&!transfer&&index===1" class="v2-tool-flow" aria-label="課程工具循環"><h2>重跑同一份 evidence，核對修正範圍</h2><ol><li>rule：demo-unsafe-query</li><li>match：比對 query／fixture 的固定示範</li><li>finding：檢查來源和 sink</li><li>triage：調查是否適用</li><li>fix：只改已確認的 query 缺陷</li><li>rescan：核對 match 是否消失，保留 uncovered scope</li></ol><p>本課改變修正條件後，自動重跑模擬掃描與已啟用的 test；真實工具需要對修改後的程式重新執行。</p><button @click="pulse++;lastChange='已重新計算模擬掃描與已啟用的 test；請核對 finding 與未涵蓋範圍。'">重新執行課程掃描與測試</button><details><summary>對照真實 Semgrep 的基本用法</summary><p>在已獲授權的本機專案，完成工具安裝後，可用 <code>semgrep scan --config p/default .</code> 掃描。固定要查的程式範圍與 rules，讀 finding、追來源／sink、調查適用性，有限修正後再用相同範圍執行。</p><p>CI 可重複執行同一組規則。真實 engine、規則和設定會影響結果，不能用本課固定 match 表預測。</p><a href="https://docs.semgrep.dev/getting-started/quickstart" target="_blank" rel="noopener noreferrer">官方 Quickstart</a> · <a href="https://docs.semgrep.dev/writing-rules/glossary" target="_blank" rel="noopener noreferrer">官方 rule／finding 用語</a></details></section>
<section v-if="!transfer&&stage.reveal" class="v2-reveal"><button :aria-expanded="revealed" @click="revealed=!revealed">{{revealed?'收起名稱與界線':'觀察後，看看這個現象的名稱'}}</button><template v-if="revealed"><p v-for="text in stage.reveal" :key="text">{{text}}</p></template></section>
<details class="v2-assumptions"><summary>這個 deterministic synthetic 模型假設了什麼？</summary><p>{{unit.assumption}}</p><p>{{result.limit}}</p><p>顏色與動畫只表示上述設定的路徑和狀態，不代表真實利用成功機率或安全評分。</p></details>
<section v-if="transfer" class="v2-transfer"><h2>整理你的判斷</h2><p>指出圖上的變化、支持判斷的 evidence，以及仍未知的範圍。可和 AI 討論，不儲存個人作答、不提供答案卡。</p></section>
<footer class="v2-navigation"><button :disabled="index===0" @click="go(index-1)">← 上一階段</button><button v-if="!transfer" @click="go(index+1)">下一階段 →</button><RouterLink v-else :to="unit.id===8?'/v2/final':'/v2/'+units[unit.id].slug">{{unit.id===8?'進入整合情境':'下一單元'}} →</RouterLink></footer>
</section></template>
