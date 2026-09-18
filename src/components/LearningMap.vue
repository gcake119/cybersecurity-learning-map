<script setup lang="ts">
import {computed,nextTick} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {units,chapters,unitById} from '../content/curriculum';
import {useProgress} from '../composables/useProgress';
import PhaseDetail from './PhaseDetail.vue';
const route=useRoute(),router=useRouter();const index=computed(()=>Number(route.params.index));const {done}=useProgress();
async function selectUnit(id:number){await router.push(`/map/${id}`);await nextTick();if(innerWidth<850)document.querySelector('.detail')?.scrollIntoView({block:'start'});}
</script>
<template><section class="intro"><div><span class="eyebrow">SECURITY / LEARN · APPLY · VERIFY</span><h1>你的系統，<em>如何保護重要資料與操作？</em></h1><p>說清楚要保護什麼 → 把保護放進系統 → 用證據確認保護有效。</p><p>以案件管理系統為共同案例。三章九單元，每一單元都從理解走向操作與判斷。</p></div></section><div class="workspace course-map"><section class="map-paper" aria-label="三章九單元學習地圖"><section v-for="(chapter,c) in chapters" :key="chapter.title" class="course-chapter"><div class="chapter-heading"><span>CHAPTER 0{{c+1}}</span><h2>{{chapter.title}}</h2><strong>{{chapter.question}}</strong><p>{{chapter.summary}}</p></div><div class="course-units"><button v-for="unit in units.filter(u=>u.chapter===c)" :key="unit.id" class="node course-node" :class="{chosen:index===unit.id}" :aria-pressed="index===unit.id" :data-node="unit.id" @click="selectUnit(unit.id)"><span class="unit-number">{{String(unit.number).padStart(2,'0')}}</span><div><small>{{done.includes(unit.id)?'✓ 已完成學習檢核':'觀念 · 實驗 · 應用'}}</small><h3>{{unit.title}}</h3><p>{{unit.goals[0]}}</p></div><span aria-hidden="true">↗</span></button></div></section></section><PhaseDetail :unit="unitById[index]"/></div></template>
