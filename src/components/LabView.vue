<script setup lang="ts">
import {computed,ref,watch,onMounted,onUnmounted,nextTick} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {labs,initial,achieved,type Values,type Outcome} from '../labs/model';
import {unitById,chapters} from '../content/curriculum';
import {useProgress} from '../composables/useProgress';
import UiIcon from './UiIcon.vue';
import ExperimentAnimation from './ExperimentAnimation.vue';
const base=import.meta.env.BASE_URL;
const route=useRoute(),router=useRouter();
const id=computed(()=>Number(route.params.index));const lab=computed(()=>labs[id.value]);
const unit=computed(()=>unitById[id.value]);
const stage=ref(0);
watch(stage,async()=>{await nextTick();document.querySelector('.lesson-stages')?.scrollIntoView({block:'start'});});
const answers=ref<number[]>([-1,-1]),submitted=ref(false),note=ref('');
const correct=computed(()=>unit.value.checks.every((q,i)=>answers.value[i]===q.answer));
const draftKey=()=>`security-course-note-v3-${id.value}`;
function loadNote(){try{note.value=localStorage.getItem(draftKey())||'';}catch{note.value='';}}
loadNote();
const noteStorageOK=ref(true);
watch(note,()=>{try{localStorage.setItem(draftKey(),note.value);}catch{noteStorageOK.value=false;}});
function verify(){submitted.value=true;if(met.value && correct.value && note.value.trim().length>=20)complete(id.value);}
function download(){const blob=new Blob([`# 單元 ${unit.value.number}｜${unit.value.title}\n\n${note.value}\n\n自我檢核：${correct.value?'通過':'未完成'}；實驗對照：${met.value?'已完成':'未完成'}\n筆記為學習者自行撰寫，未經自動語意評分。`],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`security-unit-${unit.value.number}.md`;a.click();URL.revokeObjectURL(url);}
const {done,complete}=useProgress();const values=ref<Values>(initial(lab.value));
type Run={values:Values;outcome:Outcome;number:number};
const runs=ref<Run[]>([]);const result=computed(()=>runs.value.at(-1));const previous=computed(()=>runs.value.at(-2));
const stale=computed(()=>result.value&&JSON.stringify(values.value)!==JSON.stringify(result.value.values));
const changed=computed(()=>previous.value&&result.value?lab.value.controls.filter(c=>previous.value!.values[c.key]!==result.value!.values[c.key]).map(c=>c.label):[]);
const met=ref(false);const output=ref<HTMLElement>();
async function run(){const snapshot={...values.value};const outcome=lab.value.run(snapshot);runs.value.push({values:snapshot,outcome,number:runs.value.length+1});const comparable=runs.value.filter(r=>id.value===7?r.values.threat===snapshot.threat:id.value===8?r.values.mutation===snapshot.mutation:id.value===3?r.values.actor===snapshot.actor&&(r.outcome.signature==='owner'||r.values.case===snapshot.case):true);met.value=achieved(id.value,comparable.map(r=>r.outcome.signature));await nextTick();if(window.innerWidth<700)output.value?.scrollIntoView({block:"start"});}
function reset(){values.value=initial(lab.value);runs.value=[];met.value=false;}
watch(id,()=>{reset();stage.value=0;answers.value=[-1,-1];submitted.value=false;loadNote();});function key(e:KeyboardEvent){if(e.key==='Escape')router.push(`/map/${id.value}`);}
onMounted(()=>document.addEventListener('keydown',key));onUnmounted(()=>document.removeEventListener('keydown',key));
function display(c:{key:string;options?:[string,string][]},v:Values){return typeof v[c.key]==='boolean'?(v[c.key]?'開啟':'關閉'):c.options?.find(x=>x[0]===v[c.key])?.[1]??v[c.key];}
</script>
<template>
<section class="lab-heading"><span class="eyebrow">{{chapters[unit.chapter].title}} / 單元 {{String(unit.number).padStart(2,'0')}}</span><h1>{{unit.title}}</h1><p>{{unit.question}}</p></section>
<nav class="lesson-stages" aria-label="單元學習流程"><button v-for="(label,i) in ['理解觀念','操作與比較','檢核與應用']" :key="label" :aria-current="stage===i?'step':undefined" @click="stage=i">{{i+1}} · {{label}}</button></nav>
<section v-if="stage===0" class="lesson-intro"><p class="core-conclusion">{{unit.conclusion}}</p><h2>學完這個單元，你應該能</h2><ul><li v-for="goal in unit.goals" :key="goal">{{goal}}</li></ul><div class="concept-lessons"><article v-for="([title,body],i) in unit.concepts" :key="title"><span>觀念 {{i+1}}</span><h3>{{title}}</h3><p>{{body}}</p></article></div><section class="scenario-brief"><h2>這次的情境</h2><p>{{lab.story}}</p><h3>操作路線</h3><ol><li v-for="step in unit.steps" :key="step">{{step}}</li></ol></section><div class="lesson-actions"><button class="primary" @click="stage=1">開始情境操作 →</button></div></section>
<template v-if="stage===1">
<div class="mission"><UiIcon name="lab"/><div><strong>這次要觀察什麼？</strong><p>{{lab.mission}}</p></div><span class="mission-state">{{met?'對照已完成':'等待實驗證據'}}</span></div>
<details class="operation-guide"><summary>查看操作路線與完成對照條件</summary><ol><li v-for="step in unit.steps" :key="step">{{step}}</li></ol><p>{{lab.mission}}</p></details><div class="lab-workspace has-animation">
<form class="lab-controls" @submit.prevent="run"><h2><span>01</span> 改變條件</h2><p class="lab-hint">每次改一個條件，更容易看出差異。</p>
<div v-for="control in lab.controls" :key="control.key" class="lab-field">
<label v-if="control.type==='check'" class="check-control"><input v-model="values[control.key]" type="checkbox" :name="control.key">{{control.label}}</label>
<template v-else><label :for="`control-${control.key}`">{{control.label}}</label><select v-if="control.type==='select'" :id="`control-${control.key}`" v-model="values[control.key]"><option v-for="[value,label] in control.options" :key="value" :value="value">{{label}}</option></select><input v-else :id="`control-${control.key}`" v-model="values[control.key]" type="text" autocomplete="off" spellcheck="false"></template>
</div>
<button class="primary run-lab" type="submit"><UiIcon name="play" :size="20"/>{{lab.action}}</button><button class="reset-lab" type="button" @click="reset">重設這次實驗</button><small>全部使用虛構資料，在瀏覽器內模擬。</small>
</form>
<section ref="output" class="lab-output" aria-label="實驗結果"><div class="result-header"><h2><span>02</span> 觀察結果</h2><span v-if="result">第 {{result.number}} 次執行</span></div>
<div v-if="!result" class="lab-empty"><UiIcon name="pulse" :size="52"/><h3>先執行一次，建立比較基準</h3><p>設定左側條件，按下「{{lab.action}}」。這裡會顯示處理路徑、輸出資料與原因。</p><div v-if="id===3||id===5" class="lab-art"><img :src="`${base}assets/browser.webp`" alt="測試瀏覽器"><UiIcon name="right"/><img :src="`${base}assets/server.webp`" alt="虛擬伺服器"></div></div>
<template v-else><p v-if="stale" class="stale" role="status">條件已改變，請重新執行。下方仍是上一次的結果。</p>
<div class="outcome" :class="result.outcome.tone" aria-live="polite"><strong>{{result.outcome.title}}</strong><p>{{result.outcome.summary}}</p></div>
<ExperimentAnimation :id="id" :current="result" :previous="previous" :controls="lab.controls"/>
<pre v-if="result.outcome.code" class="lab-code">{{result.outcome.code}}</pre>
<div class="result-table"><table><thead><tr><th v-for="column in result.outcome.columns" :key="column">{{column}}</th></tr></thead><tbody><tr v-for="(row,i) in result.outcome.rows" :key="i"><td v-for="(cell,j) in row" :key="j">{{cell}}</td></tr><tr v-if="!result.outcome.rows.length"><td :colspan="result.outcome.columns.length">沒有回傳資料</td></tr></tbody></table></div>
</template>
</section></div>
<section class="lab-comparison"><h2><span>03</span> 比較前後，解釋原因</h2><p v-if="!previous">先執行一次，再改變條件重做；這裡會並列最近兩次結果。</p><template v-else><p><strong>這次改了：</strong>{{changed.length?changed.join('、'):'條件相同；可檢查結果是否一致。'}}</p><div class="comparison-grid"><article v-for="r in [previous,result!]" :key="r.number"><span>第 {{r.number}} 次</span><h3>{{r.outcome.title}}</h3><dl><div v-for="c in lab.controls" :key="c.key"><dt>{{c.label}}</dt><dd>{{display(c,r.values)}}</dd></div></dl><p>{{r.outcome.summary}}</p></article></div></template>
<p v-if="result" class="lab-explanation"><UiIcon name="info"/>{{result.outcome.lesson}}</p><p v-if="met" class="challenge-complete" role="status">已取得指定對照。接著解釋原因並留下應用筆記，完成單元檢核。</p>
</section><details class="model-notes"><summary>這個模擬的範圍與延伸閱讀</summary><p>{{lab.limit}}</p><a class="source" :href="lab.source" target="_blank" rel="noopener noreferrer">閱讀原始參考資料 ↗</a><p>本次對照在離開單元後重設；已完成的單元與應用筆記保留在此瀏覽器。</p></details><div class="lesson-actions"><button class="primary" @click="stage=0">← 回到觀念</button><button class="primary" @click="stage=2">解釋結果與應用 →</button></div></template>
<section v-if="stage===2" class="lesson-check"><h2>用觀念解釋剛才的結果</h2><p>{{met?'實驗對照已取得，請完成下面的檢核。':'尚未取得指定對照；可以先作答，再回到操作補齊證據。'}}</p><fieldset v-for="(question,i) in unit.checks" :key="question.question"><legend>{{i+1}}. {{question.question}}</legend><label v-for="(option,j) in question.options" :key="option"><input v-model="answers[i]" type="radio" :name="`question-${i}`" :value="j">{{option}}</label><p v-if="submitted" class="answer-feedback" :class="{correct:answers[i]===question.answer}">{{answers[i]===question.answer?'判斷正確。':'請再想一想。'}}{{question.explanation}}</p></fieldset><h2>帶回自己的專案</h2><p>{{unit.deliverable}}</p><label for="application-note">我的安全筆記</label><textarea id="application-note" v-model="note" :placeholder="unit.template" rows="8"></textarea><p class="lab-hint">{{noteStorageOK?'筆記儲存在此瀏覽器':'筆記目前無法儲存，請匯出備份'}}；至少寫 20 字。系統只檢查是否填寫，不判定文字內容是否正確。{{unit.limit}}</p><div class="lesson-actions"><button class="primary" @click="stage=1">← 回到操作</button><button class="primary" @click="verify">檢查學習成果</button><button @click="download">匯出我的筆記</button></div><p v-if="submitted" class="check-status" role="status">{{met && correct && note.trim().length>=20?'本單元完成：已取得對照、通過觀念檢核並留下應用筆記。':!met?'還需要完成指定實驗對照。':!correct?'請依回饋修正觀念判斷，再檢查一次。':'請補上至少 20 字的應用筆記。'}}</p><RouterLink class="primary deep-entry" :to="`/practice/${id}`">進入深入練習：預測、修補與新情境 →</RouterLink><p v-if="done.includes(id)" class="challenge-complete">✓ 此單元已有完成紀錄。理解範圍以本頁學習目標為限。</p></section>
</template>
