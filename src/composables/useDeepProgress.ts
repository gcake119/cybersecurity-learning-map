import {ref} from 'vue';
const key='security-deep-progress-v1';
const done=ref<string[]>([]),storageOK=ref(true);
try{const raw:unknown=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(raw))done.value=[...new Set(raw.filter((x):x is string=>typeof x==='string'&&/^(unit[0-8]|mission[0-2])$/.test(x)))];}catch{storageOK.value=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(done.value));}catch{storageOK.value=false;}}
export function useDeepProgress(){return {done,storageOK,complete:(id:string)=>{if(/^(unit[0-8]|mission[0-2])$/.test(id)&&!done.value.includes(id)){done.value.push(id);save();}},reset:()=>{done.value=[];save();}};}
