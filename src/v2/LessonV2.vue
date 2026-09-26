<script setup lang="ts">
import {computed,ref} from 'vue';
import {useRoute} from 'vue-router';
import {bySlug,units} from './course';
import {defaults,evaluate,setControl,type State} from './model';
const route=useRoute();
const unit=computed(()=>bySlug[String(route.params.slug)]||units[0]);
const states=ref<Record<number,State>>(Object.fromEntries(units.map(u=>[u.id,structuredClone(defaults[u.id])])));
const state=computed(()=>states.value[unit.value.id]);
const result=computed(()=>evaluate(state.value));
function change(key:string,value:string|boolean){states.value[unit.value.id]=setControl(state.value,key,value)}
function toggle(key:string){change(key,!state.value.controls[key])}
</script>
<template>
<section class="v2">
<aside class="v2-map"><RouterLink to="/v2" class="v2-home">AI-assisted Security Engineering</RouterLink><RouterLink v-for="u in units" :key="u.id" :to="'/v2/'+u.slug" :class="{active:u.id===unit.id}">{{u.id}}. {{u.title}}</RouterLink></aside>
<article class="v2-lesson"><p class="v2-kicker">UNIT {{unit.id}} · Teaching case: {{unit.teaching}}</p><h1>{{unit.title}}</h1><p class="v2-question">{{unit.question}}</p>
<div class="v2-workbench"><div class="v2-controls"><h2>改變條件</h2><template v-for="ctl in unit.controls" :key="ctl.key">
<button v-if="ctl.type==='toggle'" class="v2-control" :aria-pressed="!!state.controls[ctl.key]" @click="toggle(ctl.key)">{{ctl.label}}：{{state.controls[ctl.key]?'開':'關'}}</button>
<label v-else class="v2-select">{{ctl.label}}<select :value="String(state.controls[ctl.key])" @change="change(ctl.key,($event.target as HTMLSelectElement).value)"><option v-for="o in ctl.options" :key="o.value" :value="o.value">{{o.label}}</option></select></label>
</template></div>
<div class="v2-canvas" aria-live="polite"><h2>系統狀態</h2><div class="v2-chain"><div v-for="(status,name) in result.nodes" :key="name" class="v2-node" :data-status="status"><strong>{{name}}</strong><span>{{status}}</span></div></div><p class="v2-summary">{{result.summary}}</p><dl><template v-for="(v,k) in result.metrics" :key="k"><dt>{{k}}</dt><dd>{{v}}</dd></template></dl><p class="v2-limit">限制：{{result.limit}}</p></div></div>
<section class="v2-transfer"><h2>Transfer</h2><p>換成：{{unit.transfer}}</p><p>不提示 mechanism 名稱。用同一組問題重新判斷：什麼會改變、哪條路徑受影響、需要什麼 evidence？</p></section>
</article></section>
</template>