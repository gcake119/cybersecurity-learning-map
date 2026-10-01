import {cleanState} from './model.ts';
import type {Unit} from './course.ts';

/** A direct entry reconstructs the same constraint as staged navigation.
 * A saved state is a learner revision and must not be patched again. */
export function resolveLesson(unit:Unit,query:Record<string,unknown>){
 const parsed=Number(query.stage);
 const requested=Number.isFinite(parsed)?Math.max(0,Math.trunc(parsed)):0;
 const index=query.mode==='transfer'?unit.stages.length:Math.min(unit.stages.length,requested);
 const transfer=index===unit.stages.length;
 let raw:unknown;try{raw=JSON.parse(String(query.state||'null'));}catch{raw=null;}
 const saved=raw!==null&&typeof raw==='object'&&!Array.isArray(raw);
 const state=cleanState(unit.id,saved?raw:null);
 if(!saved){
  if(transfer)Object.assign(state.controls,unit.transferPatch);
  else for(const stage of unit.stages.slice(0,index+1))Object.assign(state.controls,stage.patch);
 }
 for(const control of unit.controls){
  if(control.options&&!control.options.some(o=>o.value===state.controls[control.key]))
   state.controls[control.key]=control.options[0].value;
 }
 return {index,transfer,state};
}
