import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {units} from '../src/v2/course.ts';
import {defaults} from '../src/v2/model.ts';
import {incidents} from '../src/v2/final-model.ts';
const base=process.env.V2_QA_URL||'http://127.0.0.1:4187/cybersecurity-learning-map/';
const server=process.env.V2_QA_URL?undefined:spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4187','--strictPort'],{stdio:'ignore'});
if(server){let ready=false;for(let i=0;i<60;i++){try{if((await fetch(base)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}if(!ready){server.kill();throw Error('Preview server did not start');}}
let browser;try{browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});}catch(error){server?.kill();throw error;}
const report={base,browser:browser.version(),matrix:[],errors:[],routeChecks:[],interactionChecks:[]};
const output='output/playwright/v2';await mkdir(output,{recursive:true});
const overflow=async page=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+page.url());
async function settle(page){await page.locator('.v2-lesson,.v2-landing').waitFor();await page.waitForTimeout(30);}
async function change(page,ctl){const target=page.locator(`[data-control="${ctl.key}"]`);if(ctl.type==='toggle')await target.click();else{const v=await target.inputValue();await target.selectOption(ctl.options.find(o=>o.value!==v).value);}await page.waitForTimeout(35);}
try {
 for(const [label,width,height] of [['desktop',1280,800],['narrow',900,700],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`)});
  await page.goto(base+'#/v2');await settle(page);await overflow(page);assert.equal(await page.locator('.v2-start').count(),1);
  for(const unit of units){
   await page.goto(base+'#/v2/'+unit.slug);await settle(page);
   // Each storyboard stage has its controls; later controls are not dumped into stage 1.
   assert.equal(await page.locator('[data-control]').count(),unit.stages[0].keys.length);
   for(let i=0;i<unit.stages.length;i++){
    await page.locator('.v2-stages button').nth(i).click();await page.waitForTimeout(40);
    assert.equal(await page.locator('[data-control]').count(),unit.stages[i].keys.length,`stage controls ${unit.id}/${i}`);
    await overflow(page);
    if(unit.stages[i].reveal){assert.equal(await page.locator('.v2-reveal p').count(),0);await page.locator('.v2-reveal button').click();assert.equal(await page.locator('.v2-reveal p').count(),unit.stages[i].reveal.length);await page.locator('.v2-reveal button').click();}
    for(const key of unit.stages[i].keys){const ctl=unit.controls.find(c=>c.key===key);await change(page,ctl);await overflow(page);}
    assert.equal(await page.locator('.v2-node').count()>0,true);assert.equal(await page.locator('[data-edge]').count()>0,true);
   }
   // Independent Transfer state initialized from its own case, and all Transfer controls work.
   await page.locator('.v2-stages button').last().click();await page.waitForTimeout(40);assert.match(await page.locator('h1').innerText(),/換一個情境/);
   assert.equal(await page.locator('.v2-reveal').count(),0);assert.equal(await page.locator('[data-control]').count(),unit.controls.length);
   const transferBefore=await page.locator('.v2-canvas').innerText();
   for(const ctl of unit.controls)await change(page,ctl);
   await overflow(page);report.matrix.push({viewport:label,unit:unit.id,stages:unit.stages.length,controls:'all operated',transfer:'operated',overflow:'PASS'});
   await page.waitForTimeout(1100);await page.screenshot({path:`${output}/${label}-u${unit.id}-transfer.png`,fullPage:true});
   await page.getByRole('button',{name:'從本單元重新開始',exact:true}).click();await page.waitForTimeout(40);assert.equal(await page.locator('[data-control]').count(),unit.stages[0].keys.length);
   // At least one main parameter changes nodes / edges, not merely the summary.
   const primary={1:['policy','public'],2:['mitigation',true],3:['authorizeBefore',true],4:['input','normal'],5:['compromised','worker'],6:['diskEncryption',true],7:['sast',false],8:['identityEvidence',true]}[unit.id];
   const nodeBefore=await page.locator('.v2-graph').innerText();await page.getByRole('button',{name:'保留比較起點',exact:true}).click();
   const target=page.locator(`[data-control="${primary[0]}"]`);if(typeof primary[1]==='boolean')await target.click();else await target.selectOption(primary[1]);await page.waitForTimeout(45);
   const nodeAfter=await page.locator('.v2-graph').innerText();
   assert.equal(await page.locator('.v2-difference').count()>0,true,'snapshot comparison should show original node consequence');
   assert.notEqual(nodeBefore,nodeAfter,`node/edge consequence Unit ${unit.id}`);
   report.interactionChecks.push({viewport:label,unit:unit.id,parameter:primary[0],visibleConsequence:'PASS'});
   await page.waitForTimeout(1100);await page.screenshot({path:`${output}/${label}-u${unit.id}-comparison.png`,fullPage:true});
  }
  await page.goto(base+'#/v2/final');await settle(page);
  for(let i=0;i<incidents.length;i++){
   await page.locator('.v2-stages button').nth(i).click();await page.waitForTimeout(40);assert.match(await page.locator('h1').innerText(),new RegExp(incidents[i].title));
   for(const target of await page.locator('[data-control]').all()){if(await target.evaluate(e=>e.tagName)==='SELECT'){const values=await target.locator('option').evaluateAll(es=>es.map(e=>e.value));await target.selectOption(values.at(-1));}else await target.click();await page.waitForTimeout(30);}
   await overflow(page);assert.equal(await page.locator('.v2-node').count(),13);await page.waitForTimeout(1100);await page.screenshot({path:`${output}/${label}-final-${i+1}.png`,fullPage:true});
  }
  await page.reload();await settle(page);assert.match(await page.locator('h1').innerText(),/帶到另一個系統/);await overflow(page);
  const cumulative=await page.locator('[data-node=worker] p').innerText();await page.locator('.v2-stages button').nth(0).click();await page.waitForTimeout(40);assert.equal(await page.locator('[data-node=worker] p').innerText(),cumulative,'returning to earlier settings retains injected incidents');await page.locator('.v2-stages button').nth(5).click();await page.waitForTimeout(40);
  await page.getByRole('button',{name:'整個情境重新開始',exact:true}).click();await page.waitForTimeout(40);assert.match(await page.locator('h1').innerText(),/新 sharing feature/);
  report.matrix.push({viewport:label,unit:'Final',stages:6,controls:'all operated',transfer:'operated',overflow:'PASS'});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(base+'#/v2/trust');await settle(page);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(40);
 await page.locator('[data-control="allPaths"]').click();await page.waitForTimeout(40);const saved=await page.locator('.v2-canvas').innerText();
 await page.reload();await settle(page);assert.equal(await page.locator('.v2-canvas').innerText(),saved);assert.equal(await page.locator('.v2-stages button').nth(2).getAttribute('aria-current'),'step');
 await page.locator('.v2-stages button').nth(1).click();await page.waitForTimeout(40);await page.goBack();await page.waitForTimeout(40);assert.equal(await page.locator('.v2-stages button').nth(2).getAttribute('aria-current'),'step');await page.goForward();await page.waitForTimeout(40);assert.equal(await page.locator('.v2-stages button').nth(1).getAttribute('aria-current'),'step');
 assert.equal(await page.locator('h1').evaluate(e=>document.activeElement===e),true,'navigation focuses stage title');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'BUTTON');await page.keyboard.press('Enter');await page.waitForTimeout(40);
 for(const control of await page.locator('button,select').all()){assert.notEqual((await control.evaluate(e=>e.tagName==='SELECT'?e.closest('label')?.textContent:e.textContent))?.trim(),'','accessible control name');}
 assert.equal(await page.locator('.v2-node').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.getByRole('button',{name:'重播路徑',exact:true}).click();await overflow(page);
 await page.goto(base+'#/v2/no-such-unit');await page.waitForURL('**/#/v2');await settle(page);await page.goto(base+'#/unknown');await page.waitForURL('**/#/v2');
 await page.goto(base+'#/v2/objectives');await settle(page);await page.locator('.v2-stages button').nth(1).click();await page.waitForTimeout(30);await page.locator('[data-control="actor"]').selectOption('owner');await page.waitForTimeout(30);await page.getByRole('button',{name:'重設本階段',exact:true}).click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control="actor"]').inputValue(),'stranger');
 await page.goto(base+'#/v2/objectives?stage=999&state=broken');await settle(page);await overflow(page);await page.goto(base+'#/map/0');await page.locator('.course-chapter').first().waitFor();assert.equal(await page.locator('.course-chapter').count(),3);
 await page.goto(base+'#/v2/objectives');await settle(page);await page.locator('[data-control=policy]').selectOption('public');await page.waitForTimeout(30);await page.locator('.v2-stages button').last().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=policy]').inputValue(),'private','Transfer starts independent');await page.locator('[data-control=actor]').selectOption('owner');await page.waitForTimeout(30);await page.locator('.v2-stages button').first().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=policy]').inputValue(),'public','Teaching state retained');await page.locator('.v2-stages button').last().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=actor]').inputValue(),'owner','Transfer state retained');await page.reload();await settle(page);assert.equal(await page.locator('[data-control=actor]').inputValue(),'owner','Transfer reload');
 await page.goto(base+'#/v2/risk');await settle(page);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(30);await page.locator('[data-control=bReachable]').click();await page.waitForTimeout(30);await page.locator('.v2-stages button').first().click();await page.waitForTimeout(30);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=bReachable]').getAttribute('aria-pressed'),'false','revisiting stage does not overwrite learner setting');
 await page.goto(base+'#/v2/objectives');await settle(page);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(40);await page.locator('[data-claim=claim0]').dragTo(page.locator('[data-claim-group=confirmed]'));await page.waitForTimeout(40);assert.equal(await page.locator('[data-control=claim0]').inputValue(),'confirmed','dragging updates same model as select');
 await page.goto(base+'#/v2/evidence');await settle(page);await page.locator('.v2-stages button').nth(1).click();await page.waitForTimeout(40);assert.equal(await page.locator('[data-evidence=query]').count(),1);await page.locator('[data-control=fixQuery]').click();await page.waitForTimeout(40);await page.getByRole('button',{name:'重新執行課程掃描與測試',exact:true}).click();assert.equal(await page.locator('[data-evidence=query]').count(),0);assert.equal(await page.locator('[data-evidence=fixture]').count(),1);assert.equal(await page.locator('[data-evidence=business]').count(),1,'uncovered business logic remains');assert.equal(await page.locator('.v2-wires>path').count()>0,true,'graph has actual connecting wires');
 report.routeChecks=['native drag with keyboard select alternative','synthetic rule/triage/fix/rescan with fixture/miss','Teaching/Transfer independent state and reload','revisiting constraint preserves changed settings','Final incidents cumulative on return','landing','8 direct unit routes','reload preserves URL simulation/stage state','back/forward preserves stage state','unknown unit and unknown route redirect','restart resets stages/controls','stage reset restores defaults/constraint','progressive controls','keyboard Tab/Enter','stage focus','accessible button/select names','reduced-motion no animation with visible state','invalid query safe fallback','GitHub Pages base path assets HTTP 200','legacy map route'];
 await context.close();assert.deepEqual(report.errors,[]);
 await writeFile(output+'/report.json',JSON.stringify(report,null,2));console.log(`PASS ${report.matrix.length} viewport/surface rows; every stage/control/transfer; ${report.routeChecks.length} route/accessibility checks; ${report.interactionChecks.length} main-parameter observations`);
}finally{await browser.close();server?.kill();}
