<script setup lang="ts">
import {computed,inject,type Ref} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {phases} from '../content/learning';
import {useProgress} from '../composables/useProgress';
import MapNode from './MapNode.vue';
import PhaseDetail from './PhaseDetail.vue';
const route=useRoute(),router=useRouter();const index=computed(()=>Number(route.params.index));
const priority=inject<Ref<boolean>>('priority')!;const {done}=useProgress();
</script>
<template><section class="intro"><div><span class="eyebrow">YOUR SECURITY LEARNING ATLAS</span><h1>把概念連起來，<em>走出自己的學習路徑。</em></h1><p>從資安基礎到安全工程。點選一個節點，開始理解與練習。</p></div><div class="path-switch" role="group" aria-label="學習路徑"><button :class="{selected:!priority}" :aria-pressed="!priority" @click="priority=false">完整路徑</button><button :class="{selected:priority}" :aria-pressed="priority" @click="priority=true">Web 開發者優先</button></div></section><div class="workspace"><section class="map-paper" aria-label="九階段學習地圖"><div class="map-caption"><span>THE LEARNING PATH</span><span>01 — 09 / 自由探索</span></div><div class="nodes"><MapNode v-for="phase in phases" :key="phase.id" :phase="phase" :selected="index===phase.id" :priority="priority" :started="done.includes(phase.slide)" @select="router.push(`/map/${phase.id}`)"/></div><div class="map-legend"><span>● 目前選取</span><span>{{priority?'加深節點：Web 開發者優先路徑':'編號表示建議順序，不限制閱讀'}}</span><RouterLink to="/learn/0">從認識資安開始 →</RouterLink></div></section><PhaseDetail :phase="phases[index]"/></div></template>
