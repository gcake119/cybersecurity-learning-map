<script setup lang="ts">
import {PhCubeTransparent,PhMapTrifold,PhPresentation,PhShieldCheck,PhBug,PhTerminalWindow,PhGlobe,PhFingerprint,PhFlask,PhCode,PhGraph,PhPulse,PhUser,PhDatabase,PhArrowRight,PhArrowLeft,PhPlay,PhCopy,PhCheck,PhInfo,PhBookmarkSimple} from '@phosphor-icons/vue';
const icons={brand:PhCubeTransparent,map:PhMapTrifold,slides:PhPresentation,shield:PhShieldCheck,bug:PhBug,terminal:PhTerminalWindow,globe:PhGlobe,identity:PhFingerprint,lab:PhFlask,code:PhCode,graph:PhGraph,pulse:PhPulse,user:PhUser,database:PhDatabase,right:PhArrowRight,left:PhArrowLeft,play:PhPlay,copy:PhCopy,check:PhCheck,info:PhInfo,bookmark:PhBookmarkSimple};
defineProps<{name:keyof typeof icons;size?:number}>();
</script>
<template><component :is="icons[name]" :size="size??24" weight="light" aria-hidden="true"/></template>
