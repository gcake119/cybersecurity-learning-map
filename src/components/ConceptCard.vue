<script setup lang="ts">defineProps<{title:string;text:string;index:number}>();</script>
<template><section class="concept"><span class="concept-no">{{String(index+1).padStart(2,'0')}}</span><div><h2>{{title}}</h2><p :class="{code:text.includes('\n')}">{{text}}</p></div></section></template>
