import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4177'],{stdio:'ignore'});
const url='http://127.0.0.1:4177/cybersecurity-learning-map/';let browser;
try{
for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const button=name=>page.getByRole('button',{name,exact:true});
const go=async(id)=>{await page.goto(url+'#/lab/'+id);await button('開始情境操作 →').click();await page.locator('.system-workbench').waitFor();};
const run=async()=>{await button('執行本輪情境與驗證').click();await button('顯示完整證據').click();};
const place=async(rule,node)=>{await page.locator('.wb-rule').filter({hasText:rule}).click();await button('放置或檢視：'+node).click();};
const setup=async(id,round)=>{
if(id===1){for(const title of ['版本盤點','網路暴露與利用','業務影響'])await page.locator('.wb-rule').filter({hasText:title}).click();if(round>0)await button('將第二項移到優先').click();}
if(id===2){await page.getByLabel('目前操作環境',{exact:true}).selectOption(round===0?'test':'next');for(const cmd of ['pwd','whoami','version','cat logs/app.log'])await button(cmd).click();await page.getByLabel('這次要引用的日誌',{exact:true}).selectOption(round===0?'test':'next');}
if(round===0)return;
if(id===0){await place('存取控制','案件服務');if(round===2)await place('故障切換','備援服務');}
if(id===7){await place('案件歸屬檢查','Upload API');await place('解析資源限制','解析器');await place('允許欄位清單','資料寫入');}
if(id===3){await place('驗證身分','讀取之前');await place('核對案件歸屬','讀取之前');}
if(id===4){await place('參數化查詢','SQL 查詢');await place('HTML 輸出編碼','HTML 顯示');}
if(id===6){for(const label of ['單筆 API','批次匯入','背景工作'])await page.getByLabel(label+'連線',{exact:true}).selectOption('shared');for(const r of ['資源授權','狀態轉移','欄位清單','日誌遮罩'])await place(r,'共用服務');}
if(id===5){if(round===1){await button('權限檢查往前移').click();await button('權限檢查往前移').click();}else{await page.getByLabel('啟用資料交易與拒絕回滾').check();await page.getByLabel('通知延後到成功提交後').check();}}
if(id===8){await button('＋ 跨案件拒絕').click();if(round===2){await button('＋ 已結案拒絕').click();await button('＋ 拒絕後無副作用').click();await page.getByLabel('訊號',{exact:true}).selectOption('denied');await page.getByLabel('處理責任',{exact:true}).selectOption('oncall');await page.getByLabel('處理動作',{exact:true}).selectOption('investigate');}}
};
for(const id of [0,7,1,3,4,6,2,5,8]){
await go(id);for(let round=0;round<3;round++){if(round>0)await page.locator('.wb-rounds button').nth(round).click();await setup(id,round);await run();assert.match(await page.locator('.wb-acceptance').innerText(),/本次符合/,'id '+id+' round '+round);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
assert.match(await page.locator('.wb-next').innerText(),/三輪已完成/);
await page.reload();await button('開始情境操作 →').click();assert.match(await page.locator('.wb-next').innerText(),/三輪已完成/,'reload '+id);await button('解釋結果與應用 →').click();assert.match(await page.locator('.lesson-check').innerText(),/實驗對照已取得/);
}
// Verify position, not rule presence, decides access; stale configs never animate as new evidence.
await go(3);await page.locator('.wb-rounds button').nth(1).click();await place('驗證身分','讀取之前');await place('核對案件歸屬','回傳之後');await run();assert.match(await page.locator('.wb-results').innerText(),/資料已外洩/);await place('核對案件歸屬','讀取之前');assert.equal(await page.locator('.wb-node.active').count(),0);assert.ok(await page.locator('.wb-stale').count()>0);await run();assert.match(await page.locator('.wb-results').innerText(),/資料沒有回傳/);await button('比較最近兩次配置與結果').click();assert.equal(await page.locator('.wb-comparison article').count(),2);assert.match(await page.locator('.wb-comparison').innerText(),/規則位置/);
// Keyboard placement is equivalent to click placement.
await page.locator('.wb-rule').filter({hasText:'隱藏前端按鈕'}).press('Enter');await button('放置或檢視：瀏覽器 / API 工具').press('Enter');assert.match((await page.locator('.wb-installed').allTextContents()).join(' '),/隱藏前端按鈕/);
const downloadPromise=page.waitForEvent('download');await button('匯出配置與證據').click();const download=await downloadPromise;const exported=await readFile(await download.path(),'utf8');assert.match(exported,/配置：/);assert.match(exported,/核對|歸屬|案件/);
// All nine workbenches fit a phone, including selected rules, outputs and comparisons.
await page.setViewportSize({width:390,height:844});for(const id of [0,7,1,3,4,6,2,5,8]){await go(id);await page.locator('.wb-rounds button').nth(1).click();await setup(id,1);await run();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`mobile ${id}`);assert.equal(await button('顯示完整證據').isVisible(),true);}
await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/workbench-mobile.png',fullPage:true});
// Normal motion can pause and step; reduced motion reveals all events without auto-play.
await page.setViewportSize({width:1440,height:1000});await go(5);await page.getByLabel('減少動態',{exact:true}).uncheck();await run();await button('重播').click();await button('暫停').click();const before=Number(await page.locator('.wb-results').getAttribute('data-frame'));await button('逐步執行').click();assert.equal(Number(await page.locator('.wb-results').getAttribute('data-frame')),before+1);await page.getByLabel('減少動態',{exact:true}).check();assert.equal(await button('重播').isDisabled(),true);await page.screenshot({path:'test-results/workbench-desktop.png',fullPage:true});
// Bad or unavailable storage must not break the course.
const isolated=await browser.newContext();await isolated.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('unavailable');}}));const p=await isolated.newPage();await p.goto(url+'#/lab/0');await p.getByRole('button',{name:'開始情境操作 →'}).click();await p.getByRole('button',{name:'執行本輪情境與驗證'}).click();assert.match(await p.locator('.wb-runbar').innerText(),/無法儲存/);await isolated.close();
assert.deepEqual(errors,[]);console.log('PASS all 27 workbench UI tasks, persistence, unit evidence gate, wrong placement, stale state, comparison, export, keyboard, playback, mobile, storage failure');
}finally{await browser?.close();server.kill();}
