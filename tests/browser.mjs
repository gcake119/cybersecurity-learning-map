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
 assert.equal(await page.locator('.course-chapter').count(),3);
 assert.deepEqual(await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.node))),[0,7,1,3,4,6,2,5,8]);
 await page.locator('[data-node="3"]').click();await page.getByRole('link',{name:'開始學習與操作 ↗'}).click();await page.waitForURL('**/#/lab/3');
 const go=async id=>{await page.goto(url+'#/lab/'+id);await page.getByRole('button',{name:'開始情境操作 →'}).click();await page.locator('.run-lab').waitFor();};
 const answers={0:[1,2],7:[1,0],1:[2,0],3:[2,1],4:[0,2],6:[0,1],2:[1,2],5:[0,1],8:[2,1]};
 const finish=async id=>{await page.getByRole('button',{name:'解釋結果與應用 →'}).click();for(let i=0;i<2;i++)await page.locator(`input[name="question-${i}"]`).nth(answers[id][i]).check();await page.locator('#application-note').fill('測試筆記：在後端驗證使用者與資源關係，拒絕未授權存取，並保留回應與資料影響作為證據。');await page.getByRole('button',{name:'檢查學習成果'}).click();assert.match(await page.locator('.check-status').innerText(),/本單元完成/);await page.getByRole('button',{name:'← 回到操作'}).click();};
 await page.getByRole('button',{name:'開始情境操作 →'}).click();
 const run=async()=>{await page.locator('.run-lab').click();await page.locator('.outcome').waitFor();};
 const choose=async(key,value)=>page.locator('#control-'+key).selectOption(value);
 const enable=async(key,value=true)=>page.locator(`input[name="${key}"]`).setChecked(value);
 const title=async text=>assert.match(await page.locator('.outcome').innerText(),text);
 // Auth: establish allowed baseline, then same unauthorized request before/after protection.
 await choose('case','42');await run();await title(/200/);await choose('case','73');
 await run();await title(/200/);assert.match(await page.locator('.result-table').innerText(),/bob/);
 await enable('authz');assert.match(await page.locator('.stale').innerText(),/上一次/);await run();await title(/403/);assert.match(await page.locator('.result-table').innerText(),/沒有回傳資料/);
 assert.match(await page.locator('#progress').innerText(),/0 \/ 9/);
 await page.getByRole('button',{name:'解釋結果與應用 →'}).click();await page.getByRole('button',{name:'檢查學習成果'}).click();assert.match(await page.locator('.check-status').innerText(),/修正觀念/);await page.getByRole('button',{name:'← 回到操作'}).click();await finish(3);assert.equal(await page.locator('.comparison-grid article').count(),2);
 // Animation compares captured runs; playback never changes model evidence.
 assert.equal(await page.locator('.animation-lane').count(),2);
 await page.getByRole('button',{name:'直接看結果',exact:true}).click();
 assert.match(await page.locator('.animation-lane').first().innerText(),/1 筆資料/);
 assert.match(await page.locator('.animation-lane').last().innerText(),/0 筆資料/);
 assert.equal(await page.locator('.animation-lane').last().locator('.animated-path li.blocked').count(),1);
 assert.equal(await page.locator('.animation-lane').last().locator('.animated-path li.skipped').count(),1);
 await page.getByRole('button',{name:'回到起點',exact:true}).click();
 assert.equal(await page.locator('.animated-experiment').getAttribute('data-frame'),'0');
 await page.getByRole('button',{name:'前進一步',exact:true}).click();
 assert.equal(await page.locator('.animated-experiment').getAttribute('data-frame'),'1');
 await page.getByRole('button',{name:'播放動畫',exact:true}).click();
 await page.getByRole('button',{name:'暫停動畫',exact:true}).click();
 assert.equal(await page.locator('.animated-experiment').getAttribute('data-playing'),'false');
 await page.getByRole('checkbox',{name:'減少動態效果',exact:true}).check();
 assert.equal(await page.locator('.animated-experiment').getAttribute('data-frame'),'4');
 assert.equal(await page.getByRole('button',{name:'重播動畫',exact:true}).isDisabled(),true);
 await page.getByRole('checkbox',{name:'減少動態效果',exact:true}).uncheck();

 await choose('actor','guest');await run();await title(/401/);
 await choose('actor','alice');await choose('channel','ui');await run();await title(/沒有送出請求/);
 await page.reload();assert.match(await page.locator('#progress').innerText(),/1 \/ 9/);
 await page.getByRole('button',{name:'3 · 檢核與應用'}).click();assert.match(await page.locator('#application-note').inputValue(),/測試筆記/);
 // CIA: actual independent impacts.
 await go(0);await run();await title(/機密性/);await choose('event','edit');await run();await title(/完整性/);await choose('event','outage');await enable('guard');await run();await title(/可用性/);await choose('event','read');await run();await finish(0);
 // Priority reverses on context, not a constant card.
 await go(1);await run();await title(/優先處理 A/);await enable('public');await enable('kev');await run();await title(/優先處理 B/);await finish(1);
 // Identical command reads different virtual filesystem content.
 await go(2);await run();assert.match(await page.locator('.lab-code').innerText(),/LOCAL/);await choose('host','remote');await run();assert.match(await page.locator('.lab-code').innerText(),/VM/);await page.locator('#control-command').fill('rm -rf /');await run();await title(/不支援/);await finish(2);
 // SQL input stays literal with binding; row count is computed.
 await go(4);await run();await title(/1 筆/);await choose('query','payload');await run();assert.equal(await page.locator('.result-table tbody tr').count(),3);await choose('binding','param');await run();await title(/0 筆/);await finish(4);
 // Repeater: original request, one-field modification, then patch.
 await go(5);await run();await title(/200/);await choose('case','73');await run();assert.match(await page.locator('.outcome').innerText(),/越權/);await enable('authz');await run();await title(/403/);await finish(5);
 // Secure implementation: independently missing policies fail their own tests.
 await go(6);await run();await title(/1 \/ 4/);await enable('owner');await run();await title(/2 \/ 4/);await enable('schema');await enable('redact');await run();await title(/4 \/ 4/);await finish(6);
 // Wrong boundary protection cannot stop the threat.
 await go(7);await choose('threat','large');await enable('upload');await run();await title(/未被/);await enable('parser');await run();await title(/第 2/);await finish(7);
 // CI green can miss an injected fault; add the relevant negative test.
 await go(8);await run();await title(/缺陷漏掉/);await enable('cross');await run();await title(/阻擋/);await finish(8);
 assert.match(await page.locator('#progress').innerText(),/9 \/ 9/);
 await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/ci-comparison.png',fullPage:true});
 await page.keyboard.press('Escape');await page.waitForURL('**/#/map/8');await page.screenshot({path:'test-results/map-desktop.png',fullPage:true});
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(let id=0;id<9;id++){await go(id);await run();await page.getByRole('button',{name:'直接看結果',exact:true}).click();assert.equal(await page.locator('.animated-impact[data-result-visible="true"]').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`experiment overflow ${id}/${width}`);await page.getByRole('button',{name:'解釋結果與應用 →'}).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`check overflow ${id}/${width}`);await page.getByRole('button',{name:'1 · 理解觀念'}).click();assert.equal(await page.locator('.concept-lessons article').count(),3);assert.equal(await page.locator('.diagram-node').count(),4);await page.locator('.diagram-node').last().click();assert.equal(await page.locator('.diagram-node').last().getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.diagram-detail-number').innerText(),'4');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow lab ${id} width ${width}`);}}
 await page.screenshot({path:'test-results/lab-mobile.png',fullPage:true});
 await page.goto(url+'#/slide/6');await page.waitForURL('**/#/lab/3');await page.goto(url+'#/learn/12');await page.waitForURL('**/#/lab/7');await page.goto(url+'#/lab/99');await page.waitForURL('**/#/lab/8');
 await page.goto(url+'#/unknown');await page.waitForURL('**/#/map/0');
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'重設進度',exact:true}).click();assert.match(await page.locator('#progress').innerText(),/9 \/ 9/);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'重設進度',exact:true}).click();assert.match(await page.locator('#progress').innerText(),/0 \/ 9/);
 await page.evaluate(()=>{localStorage.setItem('security-progress-v1','[1,2,3]');localStorage.setItem('security-course-progress-v3','[2,2,-1,99,"bad"]');});await page.reload();assert.match(await page.locator('#progress').innerText(),/1 \/ 9/);
 const isolated=await browser.newContext();await isolated.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('unavailable');}}));const p=await isolated.newPage();await p.goto(url);await p.locator('.node').last().waitFor();assert.match(await p.locator('#progress').innerText(),/無法持久儲存/);
 const reducedContext=await browser.newContext({reducedMotion:'reduce'});const rp=await reducedContext.newPage();await rp.goto(url+'#/lab/3');await rp.getByRole('button',{name:'開始情境操作 →'}).click();await rp.locator('.run-lab').click();assert.equal(await rp.getByRole('checkbox',{name:'減少動態效果'}).isChecked(),true);assert.equal(await rp.locator('.animated-experiment').getAttribute('data-playing'),'false');await rp.getByRole('button',{name:'重設這次實驗',exact:true}).click();assert.equal(await rp.locator('.animated-experiment').count(),0);await reducedContext.close();
 assert.deepEqual(errors,[]);console.log('PASS: pyramid curriculum, objectives, knowledge gates, note persistence and all nine completions; all 9 scenario models, changing data outputs, comparisons, completion evidence, UI bypass, stale state, legacy URLs, responsive layouts and storage edge cases.');
}finally{await browser?.close();server.kill();}
