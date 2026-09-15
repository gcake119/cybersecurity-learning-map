<script setup lang="ts">
import {computed,onMounted,onUnmounted} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {phases,slides} from '../content/learning';
import PhaseDetail from './PhaseDetail.vue';import ConceptCard from './ConceptCard.vue';
const route=useRoute(),router=useRouter();const index=computed(()=>Number(route.params.index));const slide=computed(()=>slides[index.value]);const phase=computed(()=>phases[slide.value.phase]);
function move(step:number){const next=index.value+step;if(next>=0&&next<slides.length)router.push(`/slide/${next}`);}
function keydown(e:KeyboardEvent){if(e.altKey||e.ctrlKey||e.metaKey||(e.target instanceof HTMLElement&&(e.target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='Escape')router.push(`/map/${phase.value.id}`);}
onMounted(()=>document.addEventListener('keydown',keydown));onUnmounted(()=>document.removeEventListener('keydown',keydown));
let start:[number,number]|undefined;
function touchstart(e:TouchEvent){if(e.touches.length!==1){start=undefined;return;}start=[e.touches[0].clientX,e.touches[0].clientY];}
function touchend(e:TouchEvent){if(!start)return;const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=undefined;if(Math.abs(dx)>90&&Math.abs(dy)<50)move(dx<0?1:-1);}
</script>
<template><section class="slide-heading"><RouterLink :to="`/map/${phase.id}`">← 返回學習地圖</RouterLink><span>{{phase.title}} / {{String(index+1).padStart(2,'0')}} OF 16</span></section><div class="slide-workspace" @touchstart.passive="touchstart" @touchend.passive="touchend" @touchcancel="start=undefined"><nav class="rail" aria-label="階段導覽"><RouterLink v-for="p in phases" :key="p.id" :class="{current:p.id===phase.id}" :to="`/slide/${p.slide}`"><b>{{String(p.id+1).padStart(2,'0')}}</b><span>{{p.title}}</span></RouterLink></nav><article class="slide-paper" :class="phase.color"><span class="eyebrow">CHAPTER {{String(phase.id+1).padStart(2,'0')}} / {{phase.tags}}</span><h1 tabindex="-1">{{slide.title}}</h1><p class="lead">{{slide.intro}}</p><div class="concepts"><ConceptCard v-for="([title,text],i) in slide.items" :key="i" :title="title" :text="text" :index="i"/></div><div class="slide-controls"><button :disabled="index===0" @click="move(-1)">← 上一頁</button><span>{{String(index+1).padStart(2,'0')}} <span class="slash">/</span> 16</span><RouterLink v-if="index===15" class="primary" to="/map/8">回到地圖 ↗</RouterLink><button v-else class="primary" @click="move(1)">下一頁 →</button></div></article><PhaseDetail :phase="phase" :slide="slide" :index="index"/></div></template>
