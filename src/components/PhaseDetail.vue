<script setup lang="ts">
import type {Phase} from '../content/learning';import {labs} from '../labs/model';
defineProps<{phase:Phase}>();
</script>
<template><aside class="detail"><span class="eyebrow">EXPERIMENT / {{String(phase.id+1).padStart(2,'0')}}</span><h2>{{labs[phase.id].title}}</h2><p>{{labs[phase.id].story}}</p><hr><h3>這次要觀察什麼？</h3><p>{{labs[phase.id].mission}}</p><RouterLink class="primary" :to="`/lab/${phase.id}`">開始情境實驗 ↗</RouterLink><div class="side-note">改變條件 → 執行 → 比較結果<br>全部使用瀏覽器內的虛構測試資料。</div></aside></template>
