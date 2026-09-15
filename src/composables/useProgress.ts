import { ref, computed } from 'vue';
import { slides } from '../content/learning';
const key='security-progress-v1';
const done=ref<number[]>([]), storageOK=ref(true);
try { const saved: unknown=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(saved))done.value=[...new Set(saved.filter((x): x is number=>Number.isInteger(x)&&x>=0&&x<slides.length))]; }catch{storageOK.value=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(done.value));}catch{storageOK.value=false;}}
export function useProgress(){return {done,storageOK,percent:computed(()=>Math.round(done.value.length/slides.length*100)),toggle:(index:number)=>{done.value=done.value.includes(index)?done.value.filter(x=>x!==index):[...done.value,index];save();},reset:()=>{done.value=[];save();}};}
