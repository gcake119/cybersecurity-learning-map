import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4175'],{stdio:'ignore'});
const url='http://127.0.0.1:4175/cybersecurity-learning-map/';let browser;
const plans={0:[{}, {entry:true}, {shared:true}],7:[{}, {fields:true}, {resource:true}],1:[{}, {decision:'A'}, {decision:'B'}],3:[{}, {policy:'role'}, {policy:'role',org:true,state:true}],4:[{}, {param:true}, {param:true,encode:true}],6:[{}, {shared:true,log:true}, {shared:true,state:true,log:true}],2:[{log:'old'}, {log:'new'}, {log:'next'}],5:[{}, {order:'early'}, {transaction:true,after:true}],8:[{}, {owner:true}, {state:true,side:true}]};
const predictions={0:['spread','safe','safe'],7:['exposed','safe','safe'],1:['unknown','A','B'],3:['leak','allowed','denied'],4:['both','display','safe'],6:['unsafe','safe','safe'],2:['mismatch','matched','matched'],5:['changed','safe','safe'],8:['missed','detected','detected']};
try{
 for(let i=0;i<60;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const configure=async config=>{for(const [key,value] of Object.entries(config)){if(typeof value==='boolean')await page.locator(`input[name="${key}"]`).setChecked(value);else await page.locator('#deep-'+key).selectOption(value);}};
 const run=async pred=>{await page.locator('#deep-prediction').selectOption(pred);await page.locator('.run-deep').click();await page.locator('.prediction-feedback').waitFor();};
 const finish=async()=>{await page.getByRole('button',{name:'整理證據',exact:true}).click();for(const key of ['claim','evidence','limit'])await page.locator('#deep-'+key).fill('測試筆記：根據本次請求、資料與通知的實際影響，驗證指定需求並記錄尚未涵蓋的情境。');await page.locator('.finish-deep').click();assert.match(await page.locator('.check-status').innerText(),/已完成/);};
 await page.goto(url+'#/practice/3');await page.locator('.run-deep').waitFor();assert.equal(await page.locator('.run-deep').isDisabled(),true);
 await page.getByRole('button',{name:'整理證據',exact:true}).click();await page.locator('.finish-deep').click();assert.match(await page.locator('.check-status').innerText(),/三輪/);await page.getByRole('button',{name:'← 回到情境',exact:true}).click();
 await run('denied');assert.match(await page.locator('.prediction-feedback').innerText(),/不同/);
 await page.waitForFunction(()=>document.querySelector('.animated-experiment')?.dataset.frame==='1');assert.equal(await page.locator('.animated-experiment').getAttribute('data-playing'),'false');await page.locator('.checkpoint-question').waitFor();
 await page.locator('#deep-prediction').selectOption('leak');await configure({org:true});assert.equal(await page.locator('#deep-prediction').inputValue(),'');await page.locator('.stale').waitFor();
 for(const id of [0,7,1,3,4,6,2,5,8]){
  await page.goto(url+'#/practice/'+id);
  for(let round=0;round<3;round++){
   await page.getByRole('navigation',{name:'深入練習輪次'}).getByRole('button').nth(round).click();
   await configure(plans[id][round]);
   if(id===1&&round>0)for(let i=0;i<3;i++)await page.getByRole('button',{name:'查看下一份證據'}).click();
   await run(predictions[id][round]);assert.match(await page.locator('.prediction-feedback').innerText(),/符合本輪目標/);
   await page.getByRole('button',{name:'直接看結果',exact:true}).click();
   assert.ok(await page.locator('.deep-result-table tbody tr').count()>0);
   if(id===5&&round===2)assert.match(await page.locator('.deep-result-table').innerText(),/open/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`desktop ${id}/${round}`);
  }
  await finish();
 }
 assert.match(await page.locator('.deep-progress').innerText(),/深入 9 \/ 9/);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'匯出實驗證據與筆記'}).click();const download=await downloadPromise;assert.match(await readFile(await download.path(),'utf8'),/第 3 次/);
 await page.reload();await page.getByRole('button',{name:'整理證據',exact:true}).click();assert.match(await page.locator('#deep-claim').inputValue(),/測試筆記/);assert.equal(await page.locator('.evidence-checklist').innerText().then(x=>(x.match(/仍需完成/g)||[]).length),3);assert.match(await page.locator('.deep-links').innerText(),/已有深入完成紀錄/);
 const missionFixes=[{asset:'all',owner:true,fields:true,resource:true,priority:'context'},{service:true,state:true,fields:true,redact:true},{env:'target',repair:true,cross:true,effects:true,monitor:true,response:true}];
 for(let id=0;id<3;id++){await page.goto(url+'#/mission/'+id);for(let round=0;round<3;round++){await page.getByRole('navigation',{name:'深入練習輪次'}).getByRole('button').nth(round).click();if(round)await configure(missionFixes[id]);await run(round?'safe':'gap');assert.match(await page.locator('.prediction-feedback').innerText(),/符合本輪目標/);}await finish();}
 assert.match(await page.locator('.deep-progress').innerText(),/整合 3 \/ 3/);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/deep-evidence.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 for(const route of [...Object.keys(plans).map(id=>'practice/'+id),'mission/0','mission/1','mission/2']){await page.goto(url+'#/'+route);await run(route.startsWith('mission')?'gap':predictions[route.split('/')[1]][0]);await page.getByRole('button',{name:'直接看結果',exact:true}).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`mobile ${route}`);}
 await page.screenshot({path:'test-results/deep-mobile.png',fullPage:true});
 await page.goto(url+'#/map/0');assert.equal(await page.locator('.chapter-mission').count(),3);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile map');
 await page.goto(url+'#/mission/99');await page.waitForURL('**/#/mission/2');await page.goto(url+'#/practice/99');await page.waitForURL('**/#/practice/8');
 const unavailable=await browser.newContext();await unavailable.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('no storage');}}));const p=await unavailable.newPage();await p.goto(url+'#/practice/0');await p.getByRole('button',{name:'整理證據',exact:true}).click();assert.match(await p.locator('.deep-notes').innerText(),/儲存失敗/);assert.equal(await p.locator('.finish-deep').isEnabled(),true);await unavailable.close();
 assert.deepEqual(errors,[]);console.log('PASS all 27 deep rounds, 9 mission rounds, prediction gating, checkpoint pause, evidence export, progress/notes, responsive views and storage fallback.');
}finally{await browser?.close();server.kill();}
