<script setup lang="ts">
import {computed,ref,watch,onMounted,onUnmounted,nextTick} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {labs,initial,achieved,type Values,type Outcome} from '../labs/model';
import {phases} from '../content/learning';
import {useProgress} from '../composables/useProgress';
import UiIcon from './UiIcon.vue';
const base=import.meta.env.BASE_URL;
const route=useRoute(),router=useRouter();
const id=computed(()=>Number(route.params.index));const lab=computed(()=>labs[id.value]);
const {done,complete}=useProgress();const values=ref<Values>(initial(lab.value));
type Run={values:Values;outcome:Outcome;number:number};
const runs=ref<Run[]>([]);const result=computed(()=>runs.value.at(-1));const previous=computed(()=>runs.value.at(-2));
const stale=computed(()=>result.value&&JSON.stringify(values.value)!==JSON.stringify(result.value.values));
const changed=computed(()=>previous.value&&result.value?lab.value.controls.filter(c=>previous.value!.values[c.key]!==result.value!.values[c.key]).map(c=>c.label):[]);
const met=ref(false);const output=ref<HTMLElement>();
async function run(){const snapshot={...values.value};const outcome=lab.value.run(snapshot);runs.value.push({values:snapshot,outcome,number:runs.value.length+1});const comparable=runs.value.filter(r=>id.value===7?r.values.threat===snapshot.threat:id.value===8?r.values.mutation===snapshot.mutation:id.value===3?r.values.actor===snapshot.actor&&r.values.case===snapshot.case:true);met.value=achieved(id.value,comparable.map(r=>r.outcome.signature));if(met.value)complete(id.value);await nextTick();if(window.innerWidth<700)output.value?.scrollIntoView({block:"start"});}
function reset(){values.value=initial(lab.value);runs.value=[];met.value=false;}
watch(id,reset);function key(e:KeyboardEvent){if(e.key==='Escape')router.push(`/map/${id.value}`);}
onMounted(()=>document.addEventListener('keydown',key));onUnmounted(()=>document.removeEventListener('keydown',key));
function display(c:{key:string;options?:[string,string][]},v:Values){return typeof v[c.key]==='boolean'?(v[c.key]?'開啟':'關閉'):c.options?.find(x=>x[0]===v[c.key])?.[1]??v[c.key];}
</script>
<template>
<section class="lab-heading"><span class="eyebrow">實驗 {{String(id+1).padStart(2,'0')}} / {{phases[id].title}}</span><h1>{{lab.title}}</h1><p>{{lab.story}}</p></section>
<div class="mission"><UiIcon name="lab"/><div><strong>這次要觀察什麼？</strong><p>{{lab.mission}}</p></div><span class="mission-state">{{done.includes(id)?'已完成比較':'等待實驗證據'}}</span></div>
<div class="lab-workspace">
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
<ol class="execution-trace"><li v-for="([stage,detail],i) in result.outcome.trace" :key="stage"><span>{{i+1}}</span><div><strong>{{stage}}</strong><p>{{detail}}</p></div></li></ol>
<pre v-if="result.outcome.code" class="lab-code">{{result.outcome.code}}</pre>
<div class="result-table"><table><thead><tr><th v-for="column in result.outcome.columns" :key="column">{{column}}</th></tr></thead><tbody><tr v-for="(row,i) in result.outcome.rows" :key="i"><td v-for="(cell,j) in row" :key="j">{{cell}}</td></tr><tr v-if="!result.outcome.rows.length"><td :colspan="result.outcome.columns.length">沒有回傳資料</td></tr></tbody></table></div>
</template>
</section></div>
<section class="lab-comparison"><h2><span>03</span> 比較前後，解釋原因</h2><p v-if="!previous">先執行一次，再改變條件重做；這裡會並列最近兩次結果。</p><template v-else><p><strong>這次改了：</strong>{{changed.length?changed.join('、'):'條件相同；可檢查結果是否一致。'}}</p><div class="comparison-grid"><article v-for="r in [previous,result!]" :key="r.number"><span>第 {{r.number}} 次</span><h3>{{r.outcome.title}}</h3><dl><div v-for="c in lab.controls" :key="c.key"><dt>{{c.label}}</dt><dd>{{display(c,r.values)}}</dd></div></dl><p>{{r.outcome.summary}}</p></article></div></template>
<p v-if="result" class="lab-explanation"><UiIcon name="info"/>{{result.outcome.lesson}}</p><p v-if="met" class="challenge-complete" role="status">已觀察到任務要求的對照結果，這個實驗已記錄完成。</p>
</section><details class="model-notes"><summary>這個模擬的範圍與延伸閱讀</summary><p>{{lab.limit}}</p><a class="source" :href="lab.source" target="_blank" rel="noopener noreferrer">閱讀原始參考資料 ↗</a><p>完成狀態表示已做過指定對照，不等同於已掌握所有相關技術。重設實驗不會清除已記錄的進度。</p></details>
</template>
