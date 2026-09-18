import {ref,computed} from 'vue';
const key='security-course-progress-v3';
const done=ref<number[]>([]),storageOK=ref(true);
try{const saved:unknown=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))done.value=[...new Set(saved.filter((x):x is number=>Number.isInteger(x)&&x>=0&&x<9))];}catch{storageOK.value=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(done.value));}catch{storageOK.value=false;}}
export function useProgress(){return {done,storageOK,percent:computed(()=>Math.round(done.value.length/9*100)),complete:(id:number)=>{if(Number.isInteger(id)&&id>=0&&id<9&&!done.value.includes(id)){done.value=[...done.value,id];save();}},reset:()=>{done.value=[];save();}};}
