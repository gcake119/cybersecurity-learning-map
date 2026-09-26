import assert from 'node:assert/strict';

// Read rendered colors, including child labels and ancestor backgrounds.
// Deliberately independent of CSS tokens/selectors so cascade regressions fail.
export async function measure(target){
 return target.evaluate(root=>{
  const rgb=s=>s.match(/[\d.]+/g).map(Number);
  const blend=(fg,bg)=>[...fg.slice(0,3).map((v,i)=>v*(fg[3]??1)+bg[i]*(1-(fg[3]??1))),1];
  function background(e){if(!e)return [255,255,255,1];return blend(rgb(getComputedStyle(e).backgroundColor),background(e.parentElement));}
  function ratio(a,b){const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  const cs=getComputedStyle(root),bg=background(root),parentBg=background(root.parentElement);
  const labels=[root,...root.querySelectorAll('span,strong,small')].filter(e=>e.textContent.trim());
  const text=labels.map(e=>{const s=getComputedStyle(e),b=background(e);let opacity=1;for(let n=e;n;n=n.parentElement)opacity*=Number(getComputedStyle(n).opacity);return {label:e.textContent.trim().slice(0,120),foreground:s.color,background:b.slice(0,3),opacity,contrast:ratio(blend(rgb(s.color),b),b)};});
  return {text,foreground:cs.color,background:cs.backgroundColor,disabled:root.matches(':disabled'),selected:root.matches('[aria-current=step],[aria-pressed=true]'),active:root.matches(':active'),focused:root.matches(':focus-visible'),borderContrast:ratio(rgb(cs.borderTopColor),parentBg),outline:cs.outlineStyle,outlineWidth:cs.outlineWidth,outlineContrast:ratio(rgb(cs.outlineColor),parentBg)};
 });
}
export function assertReadable(sample,label){
 for(const text of sample.text){assert.equal(text.opacity,1,`${label}: inherited opacity obscures text`);assert.ok(text.contrast>=4.5,`${label}: ${text.label} contrast ${text.contrast.toFixed(3)} < 4.5`);}
}
export function contrastAudit(report,output){
 const seen=new Set();
 return async function audit(page,surface,{states=true,screenshots=false}={}){
  const controls=page.locator('.v2-landing :is(a,summary),.v2-lesson :is(button,select,a,summary)');
  for(const target of await controls.all()){
   if(!await target.isVisible())continue;
   const identity=await target.evaluate(e=>({tag:e.tagName,key:e.getAttribute('data-control')||e.textContent.trim(),isFilled:e.matches('.v2-start,[aria-current=step],[aria-pressed=true]'),isBox:e.matches('button,select,.v2-start,.v2-grid a')}));
   const label=`${surface}/${identity.key}`,initial=await measure(target);assertReadable(initial,label);
   if(identity.isBox)assert.ok(initial.borderContrast>=3,`${label}: control boundary < 3`);
   report.push({surface,control:identity.key,state:initial.disabled?'disabled':initial.selected?'selected':'default',...initial});
   const key=JSON.stringify([surface.split('/').slice(0,2),identity.key,initial.selected,initial.disabled]);
   if(!states||seen.has(key))continue;seen.add(key);
   const shot=async state=>{if(screenshots&&await target.getAttribute('class')==='v2-start')await page.screenshot({path:`${output}/${surface.split('/')[0]}-landing-${state}.png`});};
   if(initial.disabled){await target.hover();const sample=await measure(target);assertReadable(sample,label+'/disabled-hover');assert.equal(sample.foreground,initial.foreground);assert.equal(sample.background,initial.background);report.push({surface,control:identity.key,state:'disabled-hover',...sample});await page.mouse.move(0,0);continue;}
   await target.scrollIntoViewIfNeeded();await shot('default');
   await target.hover();let sample=await measure(target);assertReadable(sample,label+'/hover');
   if(identity.isFilled)assert.equal(sample.foreground,initial.foreground,`${label}: filled hover keeps foreground`);
   report.push({surface,control:identity.key,state:'hover',...sample});await shot('hover');
   // Select popup is OS-rendered; do not claim its active/open state is covered.
   if(identity.tag!=='SELECT'){
    await page.mouse.down();sample=await measure(target);assert.equal(sample.active,true,`${label}: actual pointer active`);assertReadable(sample,label+'/active');
    if(identity.isFilled)assert.equal(sample.foreground,initial.foreground,`${label}: filled active keeps foreground`);
    report.push({surface,control:identity.key,state:'active',...sample});await shot('active');
    // Release outside target to cancel click without changing the simulation.
    await page.mouse.move(0,0);await page.mouse.up();
    await page.evaluate(()=>getSelection()?.removeAllRanges());
   }else await page.mouse.move(0,0);
   await page.keyboard.press('Tab');await target.focus();sample=await measure(target);
   assert.equal(sample.focused,true,`${label}: actual keyboard focus-visible`);assertReadable(sample,label+'/focus');assert.equal(sample.outline,'solid');assert.equal(sample.outlineWidth,'3px');assert.ok(sample.outlineContrast>=3,`${label}: focus outline < 3`);
   report.push({surface,control:identity.key,state:'focus',...sample});await shot('focus');
  }
  await page.evaluate(()=>{document.activeElement?.blur();getSelection()?.removeAllRanges();});await page.mouse.move(0,0);
 };
}
