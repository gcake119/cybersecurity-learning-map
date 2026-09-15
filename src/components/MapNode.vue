<script setup lang="ts">
import type {Phase} from '../content/learning';
defineProps<{phase:Phase;selected:boolean;priority:boolean;started:boolean}>();
defineEmits<{select:[]}>();
</script>
<template><button class="node" :class="[phase.color,{chosen:selected,muted:priority&&phase.id<3}]" :aria-pressed="selected" :data-node="phase.id" @click="$emit('select')"><span class="node-top"><span class="number">{{String(phase.id+1).padStart(2,'0')}}</span><span>{{started?'✓ 已開始完成':priority&&phase.id===3?'優先起點':phase.id<4?'建立基礎':phase.id<6?'觀察與實驗':'帶回開發'}}</span><span>↗</span></span><h2>{{phase.title}}</h2><p>{{phase.subtitle}}</p><small>{{phase.tags}}</small></button></template>
