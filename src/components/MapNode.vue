<script setup lang="ts">
import type {Phase} from '../content/learning';import UiIcon from './UiIcon.vue';
defineProps<{phase:Phase;selected:boolean;priority:boolean;started:boolean}>();defineEmits<{select:[]}>();const icons=['shield','bug','terminal','globe','identity','lab','code','graph','pulse'] as const;
</script>
<template><button class="node" :class="{chosen:selected,muted:priority&&phase.id<3}" :aria-pressed="selected" :data-node="phase.id" @click="$emit('select')"><span class="node-number">{{String(phase.id+1).padStart(2,'0')}}</span><div class="node-symbol"><UiIcon :name="icons[phase.id]" :size="40"/></div><div class="node-copy"><small>{{started?'已開始完成':priority&&phase.id===3?'優先起點':phase.id<4?'建立基礎':phase.id<6?'觀察與實驗':'帶回開發'}}</small><h2>{{phase.title}}</h2><p>{{phase.subtitle}}</p><span class="node-tags">{{phase.tags}}</span></div><UiIcon name="right" :size="19"/></button></template>
