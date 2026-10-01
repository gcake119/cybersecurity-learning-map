<script setup lang="ts">
import {computed,ref,watch} from 'vue';
import {useRoute} from 'vue-router';
import {units,bySlug} from './course';
const route=useRoute();
const expanded=ref(false);
const current=computed(()=>route.name==='v2-final'?'整合情境':bySlug[String(route.params.slug)]?.title??'課程入口');
watch(()=>route.path,()=>{expanded.value=false;});
</script>
<template><aside class="v2-course-sidebar"><RouterLink class="v2-course-brand" to="/v2">資安學習地圖</RouterLink><p class="v2-course-position" aria-live="polite">目前：{{current}}</p><button class="v2-menu-toggle" type="button" :aria-expanded="expanded" aria-controls="course-chapters" @click="expanded=!expanded">{{expanded?'收起章節':'選擇章節'}}</button><nav id="course-chapters" class="v2-chapters" :class="{expanded}" aria-label="章節導覽"><RouterLink to="/v2" :aria-current="route.name==='v2-home'?'page':undefined">課程入口與學習範圍</RouterLink><RouterLink v-for="unit in units" :key="unit.id" :to="'/v2/'+unit.slug" :aria-current="route.params.slug===unit.slug?'page':undefined"><span>{{unit.id}}</span>{{unit.title}}</RouterLink><RouterLink to="/v2/final" :aria-current="route.name==='v2-final'?'page':undefined">整合情境與遷移練習</RouterLink></nav></aside></template>
