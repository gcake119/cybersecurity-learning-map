<script setup lang="ts">
import { watch, nextTick } from 'vue';
import CourseNavigation from './v2/CourseNavigation.vue';
import { useRoute } from 'vue-router';
import { bySlug } from './v2/course';
const route = useRoute();
function focusMain() { document.querySelector<HTMLElement>('main')?.focus(); }
watch(() => route.fullPath, () => {
  const title = route.name === 'v2-final' ? '整合情境' : bySlug[String(route.params.slug)]?.title ?? '資安學習地圖';
  document.title = `${title} · AI-assisted Security Engineering`;
}, { immediate: true });
watch(() => route.path, async () => { await nextTick(); focusMain(); });
</script>
<template>
  <a class="skip" href="#main" @click.prevent="focusMain">跳到內容</a>
  <div class="v2-course"><CourseNavigation /><main id="main" tabindex="-1"><RouterView /></main></div>
</template>
