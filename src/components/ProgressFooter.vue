<script setup lang="ts">
import {computed} from 'vue';import {useRoute} from 'vue-router';import {phases} from '../content/learning';import {useProgress} from '../composables/useProgress';
const {done,storageOK,percent,reset}=useProgress();const route=useRoute();const index=computed(()=>Number(route.params.index)||0);
function confirmReset(){if(confirm('清除這個瀏覽器中的實驗完成紀錄？'))reset();}
</script>
<template><footer><nav class="chapter-track" aria-label="階段導覽"><RouterLink v-for="p in phases" :key="p.id" :to="`/lab/${p.id}`" :class="{current:p.id===index}"><span class="track-dot"></span><b>{{String(p.id+1).padStart(2,'0')}} {{done.includes(p.id)?'✓':''}}</b><small>{{p.title}}</small></RouterLink></nav><div class="progress-row"><span id="progress"><b>{{percent}}%</b><progress max="9" :value="done.length" aria-label="實驗進度"/>{{done.length}} / 9 個實驗已完成 <small>{{storageOK?'僅儲存在此瀏覽器':'本次進度無法持久儲存'}}</small></span><span class="hint">完成指定對照後自動記錄 · Esc 返回地圖</span><button @click="confirmReset">重設進度</button></div></footer></template>
