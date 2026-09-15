<script setup lang="ts">
import {computed,provide,ref,watch} from 'vue';
import {useRoute} from 'vue-router';
import {phases,slides} from './content/learning';
import UiIcon from './components/UiIcon.vue';
import ProgressFooter from './components/ProgressFooter.vue';
function focusMain(){document.querySelector<HTMLElement>('main')?.focus();}
const route=useRoute();provide('priority',ref(false));
const isSlide=computed(()=>route.name==='learn');const index=computed(()=>Number(route.params.index)||0);const phase=computed(()=>phases[isSlide.value?slides[index.value]?.phase??0:index.value]??phases[0]);
watch(()=>route.fullPath,()=>{document.title=`${isSlide.value?slides[index.value]?.title:'資安學習地圖'} · Security Fieldnotes`;},{immediate:true});
</script>
<template><a class="skip" href="#main" @click.prevent="focusMain">跳到內容</a><header><RouterLink class="brand" to="/map/0"><span class="mark"><UiIcon name="brand" :size="38"/></span><span>資安學習地圖<small>SECURITY FIELDNOTES</small></span></RouterLink><nav aria-label="學習導覽"><RouterLink :to="`/map/${phase.id}`"><UiIcon name="map" :size="21"/>{{isSlide?'返回學習地圖':'學習地圖'}}</RouterLink></nav><span class="edition">從基礎到安全工程 ↗</span></header><main :class="{'slide-mode':isSlide}" id="main" tabindex="-1"><RouterView/></main><ProgressFooter/></template>
