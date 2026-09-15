import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
const url='http://127.0.0.1:4173/cybersecurity-learning-map/';
let browser;
try {
 for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('.node').last().waitFor();
 assert.equal(await page.locator('.node').count(),9);
 await page.getByRole('button',{name:'Web 開發者優先'}).click();
 assert.equal(await page.locator('.node.muted').count(),3);
 await page.locator('[data-node="3"]').click();
 await page.locator('.detail .primary').click();
 await page.waitForURL('**/#/learn/6');
 await page.getByRole('tab',{name:'Response',exact:true}).click();
 assert.match(await page.getByRole('tabpanel').innerText(),/application\/json/);
 await page.getByRole('button',{name:'權限 檢查可否存取'}).click();
 assert.match(await page.locator('.gate-explanation').innerText(),/案件 42/);
 await page.getByRole('button',{name:'播放封包流程'}).click();
 await page.waitForFunction(()=>document.querySelector('[role=status]')?.textContent.includes('3 / 3'));
 assert.equal(await page.getByRole('tab',{name:'Response',exact:true}).getAttribute('aria-selected'),'true');
 await page.locator('[data-complete]').click();
 await page.reload();await page.locator('[data-complete][aria-pressed="true"]').waitFor();
 assert.match(await page.locator('#progress').innerText(),/1 \/ 16/);
 await page.keyboard.press('ArrowRight');assert.ok(page.url().endsWith('/learn/6'));
 assert.equal(await page.getByRole('button',{name:'下一頁',exact:true}).count(),0);
 await page.getByRole('navigation',{name:'本階段主題'}).getByRole('link',{name:'UI 限制需要後端保護'}).click();await page.waitForURL('**/#/learn/7');
 await page.getByRole('navigation',{name:'本階段主題'}).getByRole('link',{name:'跟著一次 HTTP 請求'}).click();await page.waitForURL('**/#/learn/6');
 await page.keyboard.press('Escape');await page.waitForURL('**/#/map/3');
 // A reload intentionally resets the in-memory path preference. Switching modes must retain it.
 await page.getByRole('button',{name:'Web 開發者優先'}).click();
 await page.locator('.detail .primary').click();await page.keyboard.press('Escape');
 await page.locator('.node.muted').first().waitFor();
 assert.equal(await page.locator('.node.muted').count(),3);
 await mkdir('test-results',{recursive:true});
 await page.screenshot({path:'test-results/map-desktop.png',fullPage:true});
 for(let i=0;i<16;i++){
  await page.goto(url+'#/learn/'+i);await page.locator(i===6?'.http-lesson':'.concept').last().waitFor();
  if(i!==6)assert.equal(await page.locator('.concept').count(),3);
  assert.ok(await page.locator('h1').innerText());
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'desktop overflow on '+i);
 }
 await page.goto(url+'#/learn/6');await page.locator('.http-lesson').waitFor();
 await page.screenshot({path:'test-results/slide-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 for(const route of ['map/0',...Array.from({length:16},(_,i)=>'learn/'+i)]){
  await page.goto(url+'#/'+route);await page.locator(route.startsWith('map')?'.node':route==='learn/6'?'.http-lesson':'.concept').last().waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile overflow on '+route);
 }
 await page.goto(url+'#/learn/6');await page.locator('.http-lesson').waitFor();
 await page.screenshot({path:'test-results/slide-mobile.png',fullPage:true});
 await page.goto(url+'#/slide/6');await page.waitForURL('**/#/learn/6');
 await page.goto(url+'#/learn/999');await page.waitForURL('**/#/learn/15');
 await page.goto(url+'#/unknown');await page.waitForURL('**/#/map/0');
 await page.evaluate(()=>localStorage.setItem('security-progress-v1','[6,6,-1,999,"oops"]'));
 await page.reload();await page.locator('.node').last().waitFor();
 assert.match(await page.locator('#progress').innerText(),/1 \/ 16/);
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'重設進度'}).click();
 assert.match(await page.locator('#progress').innerText(),/1 \/ 16/);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'重設進度'}).click();
 assert.match(await page.locator('#progress').innerText(),/0 \/ 16/);
 const context=await browser.newContext();
 await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('storage unavailable');}}));
 const isolated=await context.newPage();await isolated.goto(url);await isolated.locator('.node').last().waitFor();
 assert.match(await isolated.locator('#progress').innerText(),/無法持久儲存/);
 assert.deepEqual(errors,[]);
 console.log('PASS: 9 map nodes; 16 learning topics on desktop/mobile; routing; keyboard; path state; progress persistence, migration and reset; unavailable storage; no page errors.');
} finally {await browser?.close();server.kill();}
