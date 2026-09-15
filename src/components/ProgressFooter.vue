<script setup lang="ts">
import {useProgress} from '../composables/useProgress';
const {done,storageOK,percent,reset}=useProgress();
function confirmReset(){if(confirm('清除這個瀏覽器中的學習進度？'))reset();}
</script>
<template><footer><span id="progress"><b>{{String(percent).padStart(2,'0')}}%</b><progress max="16" :value="done.length" aria-label="學習進度"/>{{done.length}} / 16 頁已完成 <small>{{storageOK?'僅儲存在此瀏覽器':'本次進度無法持久儲存'}}</small></span><span class="hint">← → 切換簡報 · Esc 返回地圖</span><button @click="confirmReset">重設進度</button></footer></template>
