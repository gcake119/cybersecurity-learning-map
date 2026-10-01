import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {measure,assertReadable} from './v2-contrast.mjs';
const base='http://127.0.0.1:4191/cybersecurity-learning-map/';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4191','--strictPort'],{stdio:'inherit'});
let browser;
const report={browser:'',rows:[],errors:[],notTested:['Safari / Firefox / physical mobile / screen reader','real Semgrep','Human Learning Review']};
const output='output/playwright/course-refactor';
await mkdir(output,{recursive:true});
try{
 let ready=false;for(let i=0;i<60;i++){try{if((await fetch(base)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}
 assert(ready,'preview started');
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});report.browser=browser.version();
 for(const [name,width,height] of [['desktop',1280,800],['narrow',900,700],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
  const settle=async()=>{await page.locator('.v2-lesson,.v2-landing').waitFor();await page.waitForTimeout(80);};
  const overflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto(base+'#/v2');await settle();await overflow();
  assert.match(await page.locator('.v2-scope').innerText(),/以後再學/);
  const menu=page.locator('.v2-menu-toggle');
  if(width<=1100){assert.equal(await menu.getAttribute('aria-expanded'),'false');await menu.focus();await page.keyboard.press('Enter');assert.equal(await menu.getAttribute('aria-expanded'),'true');}
  const chapter=page.locator('.v2-chapters a').filter({hasText:'一個元件失守後'});await chapter.focus();await page.keyboard.press('Enter');await settle();
  assert.match(page.url(),/blast-radius/);assert.equal(await page.locator('.v2-chapters [aria-current=page]').count(),1);
  assert.match(await page.locator('.v2-course-position').innerText(),/失守/);
  assert.equal(await page.locator('main').evaluate(e=>document.activeElement===e),true);
  if(width<=1100)assert.equal(await menu.getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('.v2-reading').isVisible(),true);
  assert.match(await page.locator('.v2-reading').innerText(),/下游自己的權限/);
  assert.equal(await page.locator('.v2-reading').evaluate(e=>getComputedStyle(e).lineHeight), '29.6px');
  await overflow();await page.screenshot({path:`${output}/${name}-course.png`,fullPage:true});
  // Current position remains available and chapter links have real focus/contrast.
  if(width<=1100){await menu.click();assertReadable(await measure(menu),name+'/menu');}
  for(const link of await page.locator('.v2-chapters a').all()){
   assertReadable(await measure(link),name+'/chapter');await page.keyboard.press('Tab');await link.focus();const sample=await measure(link);assert.equal(sample.outline,'solid');assert(sample.outlineContrast>=3);
  }
  if(width<=1100)await menu.click();
  await page.goto(base+'#/v2/trust?stage=2');await settle();
  assert.equal(await page.locator('[data-control=path]').inputValue(),'batch');
  await page.locator('[data-control=path]').selectOption('worker');await page.waitForTimeout(80);
  await page.reload();await settle();assert.equal(await page.locator('[data-control=path]').inputValue(),'worker');
  await page.locator('.v2-stages button').first().click();await page.waitForTimeout(80);await page.locator('.v2-stages button').nth(2).click();await page.waitForTimeout(80);
  assert.equal(await page.locator('[data-control=path]').inputValue(),'worker','direct-entry revisit retains revision');
  await page.goto(base+'#/v2/objectives?mode=transfer');await settle();assert.match(await page.locator('h1').innerText(),/換一個情境/);
  assert.equal(await page.locator('.v2-stages button').last().getAttribute('aria-current'),'step');
  assert.equal(await page.locator('[data-control=resource]').inputValue(),'案件資料');assert.equal(await page.locator('.v2-reading').count(),0,'Transfer does not expose teaching explanation');
  await page.goto(base+'#/v2/evidence?stage=1');await settle();
  await page.getByText('對照真實 Semgrep 的基本用法',{exact:true}).click();
  const copy=page.getByRole('button',{name:'複製Semgrep 本機掃描命令',exact:true});await copy.focus();await page.keyboard.press('Enter');
  await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'semgrep scan --config p/default .');
  assert.match(await page.locator('.v2-code-block [role=status]').innerText(),/已複製/);assertReadable(await measure(copy),name+'/copy');await overflow();
  await page.screenshot({path:`${output}/${name}-reading-copy.png`,fullPage:true});
  await page.goto(base+'#/v2/final?step=5');await settle();
  const domain=page.locator('[data-control=domain]');
  await domain.selectOption('案件系統');await page.waitForTimeout(80);const first=await page.locator('.v2-canvas').innerText();
  assert.equal(await page.locator('[data-control=sharing]').inputValue(),'private');assert.equal(await page.locator('[data-control=objective]').inputValue(),'write');
  await domain.selectOption('自動發文');await page.waitForTimeout(80);assert.equal(await page.locator('[data-control=sharing]').inputValue(),'public');
  assert.notEqual(await page.locator('.v2-canvas').innerText(),first);assert.match(await page.locator('.v2-transfer-facts').innerText(),/來源文章的讀取不是外洩/);
  await page.reload();await settle();assert.equal(await domain.inputValue(),'自動發文');assert.equal(await page.locator('[data-control=sharing]').inputValue(),'public');
  await overflow();await page.screenshot({path:`${output}/${name}-final-transfer.png`,fullPage:true});
  report.rows.push({viewport:name,chapters:'keyboard + current + focus PASS',reading:'visible + readable PASS',directRoute:'constraint + reload + revisit PASS',copy:'real clipboard PASS',transfer:'new facts + visible consequence + reload PASS',reducedMotion:'PASS',overflow:'PASS'});
  await context.close();
 }
 assert.deepEqual(report.errors,[]);await writeFile(output+'/report.json',JSON.stringify(report,null,2));console.log('PASS 3 viewport course navigation/reading/clipboard/direct-route/Transfer checks');
}finally{await browser?.close();server.kill();}
