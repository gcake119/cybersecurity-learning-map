<script setup lang="ts">
import type {Phase,Slide} from '../content/learning';
import {phases} from '../content/learning';
import {useProgress} from '../composables/useProgress';
const props=defineProps<{phase:Phase;slide?:Slide;index?:number}>();
const {done,toggle}=useProgress();
</script>
<template><aside class="detail" :class="phase.color"><span class="eyebrow">FIELD NOTE / {{String(phase.id+1).padStart(2,'0')}}</span><h2>{{phase.title}}</h2><p>{{phase.subtitle}}</p><hr><h3>你會學到</h3><p>{{phase.goal}}</p><h3>動手練習</h3><p>{{slide?.task??phase.exercise}}</p><RouterLink v-if="!slide" class="primary" :to="`/learn/${phase.slide}`">探索這個階段 <span>↗</span></RouterLink><button v-else :class="done.includes(index!)?'completed':'primary'" :aria-pressed="done.includes(index!)" data-complete @click="toggle(index!)">{{done.includes(index!)?'✓ 已完成這一頁':'標記這一頁完成'}}</button><a v-if="slide?.source" class="source" :href="slide.source" target="_blank" rel="noopener noreferrer">延伸閱讀 · 官方文件 ↗</a><div class="side-note">{{slide?'理解概念 → 做一次練習 → 留下證據':phase.id===0?'起點：先認識資產與影響。':`建議先備：${phases[phase.id-1].title}`}}</div></aside></template>
