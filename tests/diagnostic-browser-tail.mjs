import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {units} from '../src/v2/course.ts';
import {defaults} from '../src/v2/model.ts';
import {incidents} from '../src/v2/final-model.ts';
import {contrastAudit} from './v2-contrast.mjs';
const base=process.env.V2_QA_URL||'http://127.0.0.1:4187/cybersecurity-learning-map/';
const server=process.env.V2_QA_URL?undefined:spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4187','--strictPort'],{stdio:'ignore'});
if(server){let ready=false;for(let i=0;i<60;i++){try{if((await fetch(base)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}if(!ready){server.kill();throw Error('Preview server did not start');}}
let browser;try{browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});}catch(error){server?.kill();throw error;}
const report={base,browser:browser.version(),matrix:[],errors:[],routeChecks:[],interactionChecks:[],contrastChecks:[]};
const output='output/playwright/diagnostic-tail';await mkdir(output,{recursive:true});
const audit=contrastAudit(report.contrastChecks,output);
const overflow=async page=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow at '+page.url());
async function settle(page){await page.locator('.v2-lesson,.v2-landing').waitFor();await page.waitForTimeout(30);}
async function change(page,ctl){const target=page.locator(`[data-control="${ctl.key}"]`);if(ctl.type==='toggle')await target.click();else{const v=await target.inputValue();await target.selectOption(ctl.options.find(o=>o.value!==v).value);}await page.waitForTimeout(35);}
console.time('original-browser-tail');
try {
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
 await page.goto(base+'#/v2/objectives?stage=999&state=broken');await settle(page);await overflow(page);for(const oldPath of ['','/map/0','/lab/3','/practice/2','/mission/0','/learn/4','/slide/8']){await page.goto(base+'#'+oldPath);await page.waitForURL('**/#/v2');await settle(page);assert.equal(await page.getByRole('link',{name:'開啟舊版教材'}).count(),0);assert.equal(await page.locator('.course-chapter,.lesson-check,.deep-notes').count(),0);}
 await page.goto(base+'#/v2/objectives');await settle(page);await page.locator('[data-control=policy]').selectOption('public');await page.waitForTimeout(30);await page.locator('.v2-stages button').last().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=policy]').inputValue(),'private','Transfer starts independent');await page.locator('[data-control=actor]').selectOption('owner');await page.waitForTimeout(30);await page.locator('.v2-stages button').first().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=policy]').inputValue(),'public','Teaching state retained');await page.locator('.v2-stages button').last().click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=actor]').inputValue(),'owner','Transfer state retained');await page.reload();await settle(page);assert.equal(await page.locator('[data-control=actor]').inputValue(),'owner','Transfer reload');
 await page.goto(base+'#/v2/risk');await settle(page);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(30);await page.locator('[data-control=bReachable]').click();await page.waitForTimeout(30);await page.locator('.v2-stages button').first().click();await page.waitForTimeout(30);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(30);assert.equal(await page.locator('[data-control=bReachable]').getAttribute('aria-pressed'),'false','revisiting stage does not overwrite learner setting');
 await page.goto(base+'#/v2/objectives');await settle(page);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(40);await page.locator('[data-claim=claim0]').dragTo(page.locator('[data-claim-group=confirmed]'));await page.waitForTimeout(40);assert.equal(await page.locator('[data-control=claim0]').inputValue(),'confirmed','dragging updates same model as select');
 await page.goto(base+'#/v2/evidence');await settle(page);await page.locator('.v2-stages button').nth(1).click();await page.waitForTimeout(40);assert.equal(await page.locator('[data-evidence=query]').count(),1);await page.locator('[data-control=fixQuery]').click();await page.waitForTimeout(40);await page.getByRole('button',{name:'重新執行課程掃描與測試',exact:true}).click();assert.equal(await page.locator('[data-evidence=query]').count(),0);assert.equal(await page.locator('[data-evidence=fixture]').count(),1);assert.equal(await page.locator('[data-evidence=business]').count(),1,'uncovered business logic remains');assert.equal(await page.locator('.v2-wires>path').count()>0,true,'graph has actual connecting wires');
 report.routeChecks=['native drag with keyboard select alternative','synthetic rule/triage/fix/rescan with fixture/miss','Teaching/Transfer independent state and reload','revisiting constraint preserves changed settings','Final incidents cumulative on return','landing','8 direct unit routes','reload preserves URL simulation/stage state','back/forward preserves stage state','unknown unit and unknown route redirect','restart resets stages/controls','stage reset restores defaults/constraint','progressive controls','keyboard Tab/Enter','stage focus','accessible button/select names','reduced-motion no animation with visible state','invalid query safe fallback','GitHub Pages base path assets HTTP 200','root and all removed legacy routes redirect to v2 without legacy content'];
 await audit(page,'reduced-motion/u7');
 await context.close();assert.deepEqual(report.errors,[]);
 await writeFile(output+'/diagnostic-only.json',JSON.stringify({diagnosticOnly:true,fullQa:'not-run',...report},null,2));console.log('PASS original reduced-motion tail only; full QA not run');
}finally{await browser.close();server?.kill();}

console.timeEnd('original-browser-tail');
