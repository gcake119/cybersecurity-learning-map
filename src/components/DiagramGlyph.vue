<script setup lang="ts">
defineProps<{kind?:string}>();
</script>
<template>
<svg viewBox="0 0 80 70" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<g v-if="kind==='database'"><ellipse cx="40" cy="15" rx="25" ry="9" fill="var(--diagram-fill,#d9eee5)"/><path d="M15 15v38c0 12 50 12 50 0V15M15 33c0 12 50 12 50 0M15 51c0 12 50 12 50 0"/></g>
<g v-else-if="kind==='shield'"><path d="M40 6 64 15v20c0 14-13 23-24 29-11-6-24-15-24-29V15Z" fill="var(--diagram-fill,#d9eee5)"/><path d="m28 34 8 8 17-19"/></g>
<g v-else-if="kind==='browser'||kind==='terminal'"><rect x="7" y="8" width="66" height="44" rx="3" fill="var(--diagram-fill,#d9eee5)"/><path d="M7 19h66M30 52v9h20v-9M23 62h34"/><circle cx="13" cy="14" r="1"/><circle cx="19" cy="14" r="1"/><path v-if="kind==='terminal'" d="m19 28 7 6-7 6m16 0h14"/><path v-else d="M20 29h17v14H20Zm25 0h15m-15 7h15m-15 7h10"/></g>
<g v-else-if="kind==='document'"><path d="M20 5h28l13 13v46H20Z" fill="var(--diagram-fill,#d9eee5)"/><path d="M48 5v14h13M29 30h22M29 39h22M29 48h14"/></g>
<g v-else-if="kind==='user'"><circle cx="40" cy="20" r="13" fill="var(--diagram-fill,#d9eee5)"/><path d="M15 62v-9c0-24 50-24 50 0v9Z" fill="var(--diagram-fill,#d9eee5)"/></g>
<g v-else-if="kind==='branch'"><rect x="27" y="4" width="26" height="18" rx="2" fill="var(--diagram-fill,#d9eee5)"/><path d="M40 22v13H17v13m23-13h23v13"/><rect x="4" y="48" width="26" height="18" rx="2"/><rect x="50" y="48" width="26" height="18" rx="2"/></g>
<g v-else><rect v-for="y in [7,26,45]" :key="y" x="16" :y="y" width="48" height="16" rx="2" fill="var(--diagram-fill,#d9eee5)"/><path d="M25 14h19m-19 19h19m-19 19h19"/><circle v-for="y in [15,34,53]" :key="y" cx="55" :cy="y" r="2"/></g>
</svg>
</template>
