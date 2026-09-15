<script setup lang="ts">
import {computed,provide,ref,watch} from 'vue';
import {useRoute} from 'vue-router';
import {phases,slides} from './content/learning';
import ProgressFooter from './components/ProgressFooter.vue';
function focusMain(){document.querySelector<HTMLElement>('main')?.focus();}
const route=useRoute();provide('priority',ref(false));
const isSlide=computed(()=>route.name==='slide');const index=computed(()=>Number(route.params.index)||0);const phase=computed(()=>phases[isSlide.value?slides[index.value]?.phase??0:index.value]??phases[0]);
watch(()=>route.fullPath,()=>{document.title=`${isSlide.value?slides[index.value]?.title:'資安學習地圖'} · Security Fieldnotes`;},{immediate:true});
</script>
<template><a class="skip" href="#main" @click.prevent="focusMain">跳到內容</a><header><RouterLink class="brand" to="/map/0"><span class="mark">⌘</span><span>資安學習地圖<small>SECURITY FIELDNOTES</small></span></RouterLink><nav aria-label="觀看模式"><RouterLink :class="{active:!isSlide}" :to="`/map/${phase.id}`">地圖模式</RouterLink><RouterLink :class="{active:isSlide}" :to="`/slide/${isSlide?index:phase.slide}`">簡報模式</RouterLink></nav><span class="edition">從基礎到安全工程 ↗</span></header><main id="main" tabindex="-1"><RouterView/></main><ProgressFooter/></template>
