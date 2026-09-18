<script setup lang="ts">
import {useDeepProgress} from '../composables/useDeepProgress';
import {computed} from 'vue';import {useRoute} from 'vue-router';import {units} from '../content/curriculum';import {useProgress} from '../composables/useProgress';
const {done:deepDone,reset:resetDeep}=useDeepProgress();
const {done,storageOK,percent,reset}=useProgress();const route=useRoute();const index=computed(()=>route.name==='mission'?([0,3,2][Number(route.params.index)]??0):Number(route.params.index)||0);
function confirmReset(){if(confirm('清除基礎、深入與整合任務完成紀錄（保留應用筆記）？')){reset();resetDeep();}}
</script>
<template><footer><nav class="chapter-track" aria-label="階段導覽"><RouterLink v-for="p in units" :key="p.id" :to="`/lab/${p.id}`" :class="{current:p.id===index}"><span class="track-dot"></span><b>{{String(p.number).padStart(2,'0')}} {{done.includes(p.id)?'✓':''}}</b><small>{{p.title}}</small></RouterLink></nav><div class="progress-row"><span id="progress"><b>{{percent}}%</b><progress max="9" :value="done.length" aria-label="實驗進度"/>{{done.length}} / 9 個單元已完成 <small>{{storageOK?'僅儲存在此瀏覽器':'本次進度無法持久儲存'}}</small></span><span class="hint deep-progress">深入 {{deepDone.filter(k=>k.startsWith('unit')).length}} / 9 · 整合 {{deepDone.filter(k=>k.startsWith('mission')).length}} / 3</span><button @click="confirmReset">重設進度</button></div></footer></template>
