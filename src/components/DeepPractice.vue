<script setup lang="ts">
import {computed,ref,watch,nextTick} from 'vue';
import {useRoute} from 'vue-router';
import {deepLabs,deepInitial,meetsDeep} from '../labs/deep';
import {missionLabs} from '../labs/missions';
import {unitById,chapters} from '../content/curriculum';
import type {Values,Outcome} from '../labs/model';
import {useDeepProgress} from '../composables/useDeepProgress';
import ExperimentAnimation from './ExperimentAnimation.vue';
const route=useRoute();const id=computed(()=>Number(route.params.index)),mission=computed(()=>route.name==='mission');
const lab=computed(()=>mission.value?missionLabs[id.value]!:deepLabs[id.value]!);
const key=computed(()=>`${mission.value?'mission':'unit'}${id.value}`);
const {done,complete,storageOK}=useDeepProgress();
const round=ref(0),values=ref<Values>({}),known=ref(0),prediction=ref(''),hint=ref(false),showNotes=ref(false),feedback=ref('');
type Evidence={number:number;round:number;values:Values;known:number;prediction:string;correct:boolean;accepted:boolean;outcome:Outcome};
const runs=ref<Evidence[]>([]),notes=ref({claim:'',evidence:'',limit:''}),noteOK=ref(true),output=ref<HTMLElement>();
const task=computed(()=>lab.value.cases[round.value]!);
const result=computed(()=>runs.value.filter(r=>r.round===round.value).at(-1));
const previous=computed(()=>runs.value.filter(r=>r.round===round.value).at(-2));
const accepted=computed(()=>[0,1,2].map(i=>runs.value.some(r=>r.round===i&&r.accepted)));
const allMet=computed(()=>accepted.value.every(Boolean));
const stale=computed(()=>result.value&&(JSON.stringify(result.value.values)!==JSON.stringify(values.value)||known.value!==result.value.known));
function load(){round.value=0;values.value=deepInitial(lab.value,0);known.value=0;prediction.value='';runs.value=[];hint.value=false;showNotes.value=false;feedback.value='';notes.value={claim:'',evidence:'',limit:''};try{const raw=JSON.parse(localStorage.getItem('security-deep-note-'+key.value)||'null');if(raw&&['claim','evidence','limit'].every(k=>typeof raw[k]==='string'))notes.value=raw;}catch{noteOK.value=false;}}
load();watch(key,load);
watch(notes,()=>{try{localStorage.setItem('security-deep-note-'+key.value,JSON.stringify(notes.value));}catch{noteOK.value=false;}},{deep:true});
watch([values,known],()=>{prediction.value='';feedback.value='';},{deep:true});
function changeRound(i:number){round.value=i;known.value=0;prediction.value='';hint.value=false;feedback.value='';values.value=deepInitial(lab.value,i);showNotes.value=false;}
async function execute(){if(!prediction.value)return;const v={...values.value};const o=lab.value.run(v,round.value,known.value);const correct=prediction.value===o.signature;const met=mission.value?o.signature===task.value.expected:meetsDeep(id.value,round.value,v,known.value,o);runs.value.push({number:runs.value.length+1,round:round.value,values:v,known:known.value,prediction:prediction.value,correct,accepted:correct&&met,outcome:o});prediction.value='';await nextTick();output.value?.scrollIntoView({block:'start'});}
function finish(){if(!allMet.value){feedback.value='三輪都需要留下符合任務且預測正確的證據。';return;}if(Object.values(notes.value).some(s=>s.trim().length<12)){feedback.value='請分別寫下至少 12 字的保證、證據與限制。';return;}complete(key.value);feedback.value='已完成：三輪證據符合任務，並留下保證、證據與限制。文字內容仍需自行核對。';}
function exportEvidence(){const sections=runs.value.map(r=>`## 第 ${r.number} 次｜${lab.value.cases[r.round]!.title}\n- 條件：${JSON.stringify(r.values)}\n- 已查看證據：${r.known}\n- 預測：${lab.value.predictions.find(p=>p[0]===r.prediction)?.[1]}\n- 結果：${r.outcome.title}\n- 預測正確：${r.correct}\n- 符合本輪任務：${r.accepted}\n${r.outcome.rows.map(row=>'- '+row.join(' / ')).join('\n')}`);const blob=new Blob([`# ${lab.value.title}\n\n${sections.join('\n\n')}\n\n## 我的安全說明\n保證：${notes.value.claim}\n證據：${notes.value.evidence}\n限制：${notes.value.limit}\n\n筆記未經語意評分；全部為瀏覽器內虛構模擬。`],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`security-${key.value}-evidence.md`;a.click();URL.revokeObjectURL(url);}
</script>
<template>
<section class="lab-heading"><span class="eyebrow">{{mission?`第三層應用 / ${chapters[id].title}`:`單元 ${unitById[id].number} / 深入練習`}}</span><h1>{{lab.title}}</h1><p>{{lab.principle}}</p></section>
<div class="depth-path"><span>① 理解機制</span><span>② 預測變化</span><span>③ 設計保護</span><span>④ 驗證範圍</span></div>
<div class="deep-links"><RouterLink :to="mission?`/map/${[0,3,2][id]}`:`/lab/${id}`">← {{mission?'回到學習地圖':'回到基礎觀念與實驗'}}</RouterLink><span>{{done.includes(key)?'✓ 已有深入完成紀錄':'深入練習與基礎進度分開記錄'}}</span></div>
<nav class="lesson-stages" aria-label="深入練習輪次"><button v-for="(label,i) in ['引導觀察','配置與修補','新情境挑戰']" :key="label" :aria-current="round===i&&!showNotes?'step':undefined" @click="changeRound(i)">{{i+1}} · {{label}} {{accepted[i]?'✓':''}}</button><button :aria-current="showNotes?'step':undefined" @click="showNotes=true">整理證據</button></nav>
<template v-if="!showNotes">
<section class="deep-brief"><span class="eyebrow">ROUND 0{{round+1}}</span><h2>{{task.title}}</h2><p>{{task.story}}</p><strong>本輪目標：{{task.target}}</strong><p class="deep-boundary">{{lab.checkpoint}}</p><button v-if="task.hint" @click="hint=!hint">{{hint?'收起提示':'需要一點提示'}}</button><p v-if="hint">{{task.hint}}</p><p v-if="round===2" class="lab-hint">這一輪請自行選擇配置與驗證方式；可隨時回前兩輪觀察。</p></section>
<div v-if="task.facts" class="evidence-reveal"><h3>目前取得的部署證據（{{known}} / {{task.facts.length}}）</h3><ol><li v-for="fact in task.facts.slice(0,known)" :key="fact">{{fact}}</li></ol><p v-if="!known">尚未查證版本、暴露與利用條件。</p><button :disabled="known>=task.facts.length" @click="known++">查看下一份證據</button></div>
<div class="deep-workspace"><form class="lab-controls" @submit.prevent="execute"><h2>配置與預測</h2><div v-for="control in lab.controls" :key="control.key" class="lab-field"><label v-if="control.type==='check'" class="check-control"><input v-model="values[control.key]" :name="control.key" type="checkbox">{{control.label}}</label><template v-else><label :for="`deep-${control.key}`">{{control.label}}</label><select :id="`deep-${control.key}`" v-model="values[control.key]"><option v-for="[value,label] in control.options" :key="value" :value="value">{{label}}</option></select></template></div><div class="lab-field"><label for="deep-prediction">執行前，預測會發生什麼？</label><select id="deep-prediction" v-model="prediction"><option value="" disabled>先選擇你的預測</option><option v-for="[value,label] in lab.predictions" :key="value" :value="value">{{label}}</option></select></div><button class="primary run-deep" type="submit" :disabled="!prediction">驗證我的預測</button><p class="lab-hint">修改條件後需重新預測。所有資料均為本機模擬。</p></form>
<section ref="output" class="deep-output" aria-label="深入實驗結果"><div v-if="!result" class="lab-empty"><h3>先預測，再觀察</h3><p>配置條件並送出預測後，動畫會在第一個節點暫停。確認此時已知與未知的資訊，再繼續播放。</p></div><template v-else><p v-if="stale" class="stale">條件或已知證據已改變，下方仍是上一次的結果。</p><div class="prediction-feedback" :class="{correct:result.correct}"><strong>{{result.correct?'預測與結果一致':'結果和你的預測不同'}}</strong><p>你預測：{{lab.predictions.find(p=>p[0]===result!.prediction)?.[1]}}</p><p>{{result.accepted?'✓ 這次證據符合本輪目標。':'這次尚未符合本輪目標；請根據結果重新配置與預測。'}}</p></div><ExperimentAnimation :id="mission?8:id" :current="result" :previous="previous" :controls="lab.controls" generic :checkpoint="lab.checkpoint"/><p class="lab-explanation">{{result.outcome.lesson}}</p></template></section></div>
<div class="lesson-actions"><button v-if="round>0" class="primary" @click="changeRound(round-1)">← 回到前一輪</button><button v-if="round<2" class="primary" @click="changeRound(round+1)">{{round===0?'配置保護並重做 →':'接受新情境挑戰 →'}}</button><button v-else class="primary" @click="showNotes=true">整理保證與證據 →</button></div>
</template>
<section v-else class="deep-notes"><h2>哪些判斷已經有證據？</h2><ul class="evidence-checklist"><li v-for="(task,i) in lab.cases" :key="task.title">{{accepted[i]?'✓':'○'}} {{task.title}}：{{accepted[i]?'已取得符合任務且預測正確的證據':'仍需完成'}}</li></ul><details><summary>查看本次完整執行紀錄（{{runs.length}} 次）</summary><ol><li v-for="r in runs" :key="r.number">第 {{r.number}} 次 / {{lab.cases[r.round]!.title}}：{{r.outcome.title}} · {{r.correct?'預測正確':'預測待修正'}} · {{r.accepted?'符合目標':'尚未符合目標'}}</li></ol></details><label for="deep-claim">我能支持的安全保證</label><textarea id="deep-claim" v-model="notes.claim" rows="3" placeholder="描述人物、操作、條件與預期結果。"></textarea><label for="deep-evidence">證據與實作位置</label><textarea id="deep-evidence" v-model="notes.evidence" rows="4" placeholder="引用第幾次執行、改了哪些條件、資料或通知如何變化。整合任務請補上資料流、權限規則或回歸測試。"></textarea><label for="deep-limit">尚未驗證、監控與後續處理</label><textarea id="deep-limit" v-model="notes.limit" rows="4" placeholder="列出未測情境；需要時寫下監控訊號、處理人與調查／回復動作。"></textarea><p class="lab-hint">每欄至少 12 字，系統只檢查填寫，不自動判定文字論述是否正確。{{noteOK?'筆記保留於此瀏覽器。':'筆記儲存失敗，請匯出備份。'}}本次執行證據離開頁面或重新整理後重設；可匯出保留。</p><div class="lesson-actions"><button class="primary" @click="showNotes=false">← 回到情境</button><button class="primary finish-deep" @click="finish">檢查深入學習成果</button><button @click="exportEvidence">匯出實驗證據與筆記</button></div><p v-if="feedback" role="status" class="check-status">{{feedback}}</p></section>
<p class="lab-hint">{{lab.limit}} {{storageOK?'':'本次完成紀錄無法持久儲存。'}}</p>
</template>
