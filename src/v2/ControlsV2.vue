<script setup lang="ts">
import type {Control} from './course';
import type {Value} from './model';
defineProps<{controls:Control[];values:Record<string,Value>}>();
defineEmits<{change:[key:string,value:Value]}>();
</script>
<template><div class="v2-controls"><template v-for="ctl in controls" :key="ctl.key"><button v-if="ctl.type==='toggle'" type="button" class="v2-control" :data-control="ctl.key" :aria-pressed="!!values[ctl.key]" @click="$emit('change',ctl.key,!values[ctl.key])">{{ctl.label}}<span>{{values[ctl.key]?'開':'關'}}</span></button><label v-else class="v2-select">{{ctl.label}}<select :data-control="ctl.key" :value="String(values[ctl.key])" @change="$emit('change',ctl.key,($event.target as HTMLSelectElement).value)"><option v-for="o in ctl.options" :key="o.value" :value="o.value">{{o.label}}</option></select></label></template></div></template>
