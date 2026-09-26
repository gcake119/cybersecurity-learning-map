<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { bySlug } from './v2/course';
const route = useRoute();
function focusMain() { document.querySelector<HTMLElement>('main')?.focus(); }
watch(() => route.fullPath, () => {
  const title = route.name === 'v2-final' ? '整合情境' : bySlug[String(route.params.slug)]?.title ?? '資安學習地圖';
  document.title = `${title} · AI-assisted Security Engineering`;
}, { immediate: true });
</script>
<template>
  <a class="skip" href="#main" @click.prevent="focusMain">跳到內容</a>
  <main id="main" tabindex="-1"><RouterView /></main>
</template>
