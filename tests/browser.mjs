import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
const url='http://127.0.0.1:4173/cybersecurity-learning-map/';let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('.node').last().waitFor();assert.equal(await page.locator('.node').count(),9);
 assert.equal(await page.getByRole('link',{name:'簡報',exact:true}).count(),0);
 await page.getByRole('button',{name:'Web 開發者優先'}).click();assert.equal(await page.locator('.node.muted').count(),3);
 await page.locator('[data-node="3"]').click();await page.getByRole('link',{name:'開始情境實驗 ↗'}).click();await page.waitForURL('**/#/lab/3');
 const go=async id=>{await page.goto(url+'#/lab/'+id);await page.locator('.run-lab').waitFor();};
 const run=async()=>{await page.locator('.run-lab').click();await page.locator('.outcome').waitFor();};
 const choose=async(key,value)=>page.locator('#control-'+key).selectOption(value);
 const enable=async(key,value=true)=>page.locator(`input[name="${key}"]`).setChecked(value);
 const title=async text=>assert.match(await page.locator('.outcome').innerText(),text);
 // Auth: same request, different protection. Verify actual data and stale-output semantics.
 await run();await title(/200/);assert.match(await page.locator('.result-table').innerText(),/bob/);
 await enable('authz');assert.match(await page.locator('.stale').innerText(),/上一次/);await run();await title(/403/);assert.match(await page.locator('.result-table').innerText(),/沒有回傳資料/);
 assert.match(await page.locator('#progress').innerText(),/1 \/ 9/);assert.equal(await page.locator('.comparison-grid article').count(),2);
 await choose('actor','guest');await run();await title(/401/);
 await choose('actor','alice');await choose('channel','ui');await run();await title(/沒有送出請求/);
 await page.reload();assert.match(await page.locator('#progress').innerText(),/1 \/ 9/);
 // CIA: actual independent impacts.
 await go(0);await run();await title(/機密性/);await choose('event','edit');await run();await title(/完整性/);await choose('event','outage');await enable('guard');await run();await title(/可用性/);
 // Priority reverses on context, not a constant card.
 await go(1);await run();await title(/優先處理 A/);await enable('public');await enable('kev');await run();await title(/優先處理 B/);
 // Identical command reads different virtual filesystem content.
 await go(2);await run();assert.match(await page.locator('.lab-code').innerText(),/LOCAL/);await choose('host','remote');await run();assert.match(await page.locator('.lab-code').innerText(),/VM/);await page.locator('#control-command').fill('rm -rf /');await run();await title(/不支援/);
 // SQL input stays literal with binding; row count is computed.
 await go(4);await choose('query','payload');await run();assert.equal(await page.locator('.result-table tbody tr').count(),3);await choose('binding','param');await run();await title(/0 筆/);
 // Repeater: original request, one-field modification, then patch.
 await go(5);await run();await title(/200/);await choose('case','73');await run();assert.match(await page.locator('.outcome').innerText(),/越權/);await enable('authz');await run();await title(/403/);
 // Secure implementation: independently missing policies fail their own tests.
 await go(6);await run();await title(/1 \/ 4/);await enable('owner');await run();await title(/2 \/ 4/);await enable('schema');await enable('redact');await run();await title(/4 \/ 4/);
 // Wrong boundary protection cannot stop the threat.
 await go(7);await choose('threat','large');await enable('upload');await run();await title(/未被/);await enable('parser');await run();await title(/第 2/);
 // CI green can miss an injected fault; add the relevant negative test.
 await go(8);await run();await title(/缺陷漏掉/);await enable('cross');await run();await title(/阻擋/);
 assert.match(await page.locator('#progress').innerText(),/9 \/ 9/);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/ci-comparison.png',fullPage:true});
 await page.keyboard.press('Escape');await page.waitForURL('**/#/map/8');await page.screenshot({path:'test-results/map-desktop.png',fullPage:true});
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(let id=0;id<9;id++){await go(id);await run();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow lab ${id} width ${width}`);}}
 await page.screenshot({path:'test-results/lab-mobile.png',fullPage:true});
 await page.goto(url+'#/slide/6');await page.waitForURL('**/#/lab/3');await page.goto(url+'#/learn/12');await page.waitForURL('**/#/lab/7');await page.goto(url+'#/lab/99');await page.waitForURL('**/#/lab/8');
 await page.goto(url+'#/unknown');await page.waitForURL('**/#/map/0');
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'重設進度',exact:true}).click();assert.match(await page.locator('#progress').innerText(),/9 \/ 9/);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'重設進度',exact:true}).click();assert.match(await page.locator('#progress').innerText(),/0 \/ 9/);
 await page.evaluate(()=>{localStorage.setItem('security-progress-v1','[1,2,3]');localStorage.setItem('security-lab-progress-v2','[2,2,-1,99,"bad"]');});await page.reload();assert.match(await page.locator('#progress').innerText(),/1 \/ 9/);
 const isolated=await browser.newContext();await isolated.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('unavailable');}}));const p=await isolated.newPage();await p.goto(url);await p.locator('.node').last().waitFor();assert.match(await p.locator('#progress').innerText(),/無法持久儲存/);
 assert.deepEqual(errors,[]);console.log('PASS: all 9 scenario models, changing data outputs, comparisons, completion evidence, UI bypass, stale state, legacy URLs, responsive layouts and storage edge cases.');
}finally{await browser?.close();server.kill();}
