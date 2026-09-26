<script setup lang="ts">
import {ref,onMounted,onBeforeUnmount,nextTick,watch} from 'vue';
import type {Result} from './model';
const props=defineProps<{result:Result;labels?:Record<string,string>;pulse:number;before?:Result}>();
const root=ref<HTMLElement>();
const wires=ref<{d:string;status:string}[]>([]);
let observer:ResizeObserver;
function measure(){
  const canvas=root.value;if(!canvas)return;
  const bounds=canvas.getBoundingClientRect();
  const items=new Map(Array.from(canvas.querySelectorAll<HTMLElement>('[data-node]')).map(el=>[el.dataset.node!,el.getBoundingClientRect()]));
  wires.value=props.result.edges.flatMap(edge=>{const a=items.get(edge.from),b=items.get(edge.to);if(!a||!b||a===b)return [];
    const sameRow=Math.abs(a.top-b.top)<20;
    const sx=(sameRow?(a.left<b.left?a.right:a.left):a.left+a.width/2)-bounds.left;
    const sy=(sameRow?a.top+a.height/2:(a.top<b.top?a.bottom:a.top))-bounds.top;
    const tx=(sameRow?(a.left<b.left?b.left:b.right):b.left+b.width/2)-bounds.left;
    const ty=(sameRow?b.top+b.height/2:(a.top<b.top?b.top:b.bottom))-bounds.top;
    return [{d:sameRow?`M ${sx} ${sy} L ${tx} ${ty}`:`M ${sx} ${sy} L ${sx} ${(sy+ty)/2} L ${tx} ${(sy+ty)/2} L ${tx} ${ty}`,status:edge.status}];});
}
onMounted(()=>{observer=new ResizeObserver(measure);if(root.value)observer.observe(root.value);measure();});
onBeforeUnmount(()=>observer?.disconnect());
watch(()=>[props.result,props.pulse],async()=>{await nextTick();measure();});
const names:Record<string,string>={actor:'提出要求的人',document:'文件／設定',service:'服務',serviceA:'Service A',serviceB:'Service B',advisory:'套件通知',client:'要求入口',api:'API',resource:'保護的資源',input:'外部資料',interpreter:'下一個解讀器',output:'結果／目的地',worker:'Worker',db:'DB',storage:'Object Storage',provider:'Third-party',data:'資料',key:'Key',secret:'Credential',consumer:'Consumer',dependency:'Dependency',ci:'CI',artifact:'Artifact',code:'Code',sast:'Semgrep-like',tests:'Security test',background:'Background job',logs:'Logs',alerts:'Alerts',credential:'發布 credential',downstream:'下游秘密',browser:'Browser',repo:'Repo',deploy:'Deploy',app:'App'};
const statuses:Record<string,string>={ok:'本輪符合',bad:'影響／持續能力',warn:'需注意／可達',blocked:'路徑已阻擋',unknown:'尚未取得證據'};
</script>
<template>
<div class="v2-graph" aria-label="系統節點與路徑">
<div class="v2-nodes" ref="root"><svg class="v2-wires" aria-hidden="true"><defs><marker id="v2-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs><path v-for="(wire,i) in wires" :key="i" :d="wire.d" :data-status="wire.status" marker-end="url(#v2-arrow)"/></svg><section v-for="(status,id,i) in result.nodes" :key="id+':'+pulse" class="v2-node" :data-status="status" :style="{'--order':i}" :data-node="id"><h3>{{labels?.[id]||names[id]||id}}</h3><span class="v2-status">{{statuses[status]}}</span><p>{{result.details[id]}}</p><small v-if="before&&before.details[id]!==result.details[id]" class="v2-difference">原本：{{before.details[id]}}</small></section></div>
<ol class="v2-edges" aria-label="狀態傳播路徑"><li v-for="(edge,i) in result.edges" :key="i+':'+pulse" :data-status="edge.status" :style="{'--order':i}" :data-edge="edge.from+'-'+edge.to"><span>{{labels?.[edge.from]||names[edge.from]||edge.from}}</span><b aria-hidden="true">→</b><span>{{labels?.[edge.to]||names[edge.to]||edge.to}}</span><small>{{edge.label}} · {{statuses[edge.status]}}</small></li></ol>
</div>
</template>
