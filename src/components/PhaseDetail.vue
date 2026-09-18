<script setup lang="ts">
import type {Unit} from '../content/curriculum';
defineProps<{unit:Unit}>();
</script>
<template><aside class="detail"><span class="eyebrow">UNIT {{String(unit.number).padStart(2,'0')}}</span><h2>{{unit.title}}</h2><p>{{unit.conclusion}}</p><hr><h3>學完應該能</h3><ul><li v-for="goal in unit.goals" :key="goal">{{goal}}</li></ul><h3>本單元產出</h3><p>{{unit.deliverable}}</p><RouterLink class="primary" :to="`/lab/${unit.id}`">開始學習與操作 ↗</RouterLink><div class="side-note">理解觀念 → 操作比較 → 檢核應用<br>全部實驗使用虛構資料，在瀏覽器內模擬。</div></aside></template>
