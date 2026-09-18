<script setup lang="ts">
import {computed,nextTick} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {units,chapters,unitById} from '../content/curriculum';
import {useProgress} from '../composables/useProgress';
import {useDeepProgress} from '../composables/useDeepProgress';
import PhaseDetail from './PhaseDetail.vue';
const {done:deepDone}=useDeepProgress();
const route=useRoute(),router=useRouter();const index=computed(()=>Number(route.params.index));const {done}=useProgress();
async function selectUnit(id:number){await router.push(`/map/${id}`);await nextTick();if(innerWidth<850)document.querySelector('.detail')?.scrollIntoView({block:'start'});}
</script>
<template><section class="intro"><div><span class="eyebrow">SECURITY / LEARN · APPLY · VERIFY</span><h1>你的系統，<em>如何保護重要資料與操作？</em></h1><p>說清楚要保護什麼 → 把保護放進系統 → 用證據確認保護有效。</p><p>以案件管理系統為共同案例。三章九單元，每一單元都從理解走向操作與判斷。</p></div></section><div class="workspace course-map"><section class="map-paper" aria-label="三章九單元學習地圖"><section v-for="(chapter,c) in chapters" :key="chapter.title" class="course-chapter"><div class="chapter-heading"><span>CHAPTER 0{{c+1}}</span><h2>{{chapter.title}}</h2><strong>{{chapter.question}}</strong><p>{{chapter.summary}}</p></div><div class="course-units"><button v-for="unit in units.filter(u=>u.chapter===c)" :key="unit.id" class="node course-node" :class="{chosen:index===unit.id}" :aria-pressed="index===unit.id" :data-node="unit.id" @click="selectUnit(unit.id)"><span class="unit-number">{{String(unit.number).padStart(2,'0')}}</span><div><small>{{deepDone.includes('unit'+unit.id)?'✓ 已完成深入挑戰':done.includes(unit.id)?'✓ 基礎完成 · 可進入深入練習':'觀念 · 實驗 · 深入挑戰'}}</small><h3>{{unit.title}}</h3><p>{{unit.goals[0]}}</p></div><span aria-hidden="true">↗</span></button></div><RouterLink class="chapter-mission" :to="`/mission/${c}`"><span>整合任務 {{deepDone.includes('mission'+c)?'✓ 已完成':''}}</span><strong>{{['替案件文件上傳建立安全說明','保護單筆修改與批次匯入','接手有缺陷的版本並留下回歸證據'][c]}}</strong><span>組合本章能力，驗證新情境 →</span></RouterLink></section></section><PhaseDetail :unit="unitById[index]"/></div></template>
