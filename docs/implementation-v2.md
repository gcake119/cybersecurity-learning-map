# Implementation v2 — Technical QA

> 日期：2026-09-26
> Branch：`learning-map-v2`
> QA implementation HEAD：`f4ea4f49de3db1044a233f70392af05ac5392973`
> Gate：Technical QA PASS WITH FINDINGS；Ready for Human Learning Review
> Curriculum / Canonical Content 保持 confirmed meaning；不合併 main。

## 實作範圍

- `#/v2`：presentation-first 入口，單元清單按需展開。
- Unit 1–8：29 個 teaching stages 加 8 個獨立 Transfer；階段控制、可觀察狀態、術語後揭露、constraint change。
- 參數直接改 deterministic model；後果標在相關 node / edge / resource / evidence。
- 圖上實際連線、方向與狀態傳播；重播不改模型結果，reduced-motion 保留靜態後果與路徑文字。
- Before / after：保留目前比較起點，再在改變的節點顯示原本後果。
- Unit 1 Agent 提案：可拖曳到需求、待確認條件、做法；原生選單提供鍵盤等效操作。
- Teaching 與 Transfer 使用不同模擬狀態；Transfer 改情境、初始條件與資源標籤，不顯示 Unit 名稱、術語 reveal 或 mechanism 答案。
- URL 保存當前 simulation parameters、stage、Teaching / Transfer 狀態；reload、back / forward 可重建。沒有 learning-progress、個人作答或 localStorage 學習紀錄。
- Constraint 初次進入注入；再訪不覆蓋 learner 已改設定。本階段 reset 回預設／constraint，restart 清除當單元 simulation。
- `#/v2/final`：獨立 integrated surface，同一張 collaboration SaaS canvas，五個累積事件／changes 加 domain transfer。返回先前設定不移除已注入事件，前輪控制仍可調整。
- 依 2026-09-26 使用者新指示完整移除舊版；只保留 v2。根入口與所有舊網址由 fallback 導向新版入口，不沿用舊編號或學習進度。

## Storyboard traceability

| Unit | Stages / constraint | 可操作 consequence / Transfer |
| --- | --- | --- |
| 1 | 事件 → objective builder → Agent relation → private/public change | actor / document / service；合成案件角色與資料 |
| 2 | A/B context → evidence sources → B public / A mitigation | version / route / impact / exploitation / mitigation rationale；合成 hosting advisory |
| 3 | user-resource-action → worker/default policy → batch bypass | read/write side effect、API vs authoritative resource enforcement；合成 Sim-sik／案件流程 |
| 4 | input/sink → context-specific construction → rich text change | mock structure / destination / function requirement；合成 filename/parser/display/process flow |
| 5 | assumed compromise → identities/scope/routes → required storage write | reachable resources AND allowed actions，合法工作能否完成；合成 multi-service VM |
| 6 | threat location → secret lifecycle → supply chain → consumer not migrated | data/key、leaked credential、consumer、dependency/CI/artifact；合成 publishing chain |
| 7 | evidence sources → triage/fix/rescan → runtime → uncovered job | query TP-style、fixture non-applicable、refund business-logic miss、API side-effect test、logs/alerts；AI workflow Transfer |
| 8 | known/unknown → contain → recover → recurrence prevention → restore-only change | credential/runtime active paths、availability、artifact/credential/data recovery evidence；合成 self-hosted incident |
| Final | sharing → advisory → worker identity → bulk access → deploy token/artifact → domain transfer | Browser/API/DB/Worker/Storage/Third-party；Repo/CI/Artifact/Deploy；App/Logs/Alerts，同一累積系統 |

Unit 6、7 的圖與 metrics 按當下階段收斂，避免一次揭露整個 conceptual structure。Transfer 才展開該單元完整可操作設定。

## Models / assumptions

- Pure deterministic synthetic functions：`src/v2/model.ts`、`src/v2/final-model.ts`。
- 每個重要參數都在適用 context 有 observable result；automation 不要求無關控制也改變所有 sink。
- 讀取公開文件不自動視為 breach；公開讀不代表可寫。Objective builder 是候選需求，不會自動改寫角色政策。
- API policy 不自動涵蓋 batch；401/403 不單獨證明無副作用。
- Validation 與 safe construction 分開；normal input 不被一律當攻擊；rich-text 純文字輸出可安全但不滿足功能。
- Segmentation 改 route，permission 改能力；共用 credential 的繼承假設明示。Reachability 不等於 exploit success。
- Encryption 依 threat layer；app 可解密時仍可讀。Key 分離必須連「不能呼叫解密」一起成立。
- 刪原文／建立替代 token 不自動撤銷洩漏副本；consumer 未更新可造成可用性問題。
- Advisory / scanner match 不當作 confirmed exploitability；CVSS/EPSS 不當 local risk；沒有 finding 不當 secure。
- Restore、verify restore、trusted artifact、revoke、downstream rotation 是不同條件；備份／rollback 不當 confirmed recovery。
- 所有畫面可展開明示模型假設；不產生 security score、incident score 或真實利用機率。

## Unit 7 — tool boundary / copy review

主要 teaching tool 是清楚標示的 synthetic Semgrep-like model，沒有執行真實 Semgrep。

- 固定 rule → match → finding；query 的 source/sink 支持本課 TP-style 缺陷；fixture 沒有敏感 sink，供 learner triage。
- Fix 後自動重算 synthetic rescan；可另按重新執行。Query match 消失，但 fixture 與 uncovered refund business logic 仍可見。
- API test 同時檢查拒絕回應與 DB unchanged；綠燈不擴大到 background job／退款 invariant。
- Runtime 切換 login / forbidden request / bulk access，欄位、interaction ID、alert rule 分別影響可調查 evidence。
- 真實工具補充只提供基本 `semgrep scan --config p/default .`、固定範圍、triage、bounded fix、rescan 與 CI 重複執行；不做規則專精。
- 官方用語／基本使用核對：[Semgrep Quickstart](https://docs.semgrep.dev/getting-started/quickstart)、[rule glossary](https://docs.semgrep.dev/writing-rules/glossary)。固定模擬不能預測真實 engine／rules／scope 結果。

Learning Copy QA：opening 先白話問題與 phenomenon；術語由 learner 觀察後展開，首次有定義與不代表什麼；不將 Canonical Content 長文塞進畫面。新增真實工具補充只解釋已 confirmed 的基本使用範圍，沒有改 Canonical meaning。未發現 material subject-matter problem。

## Execution evidence — fixed implementation HEAD

環境：macOS arm64；Node `22.23.2`；pnpm `11.19.0`。

| Check | 實際結果 |
| --- | --- |
| `pnpm install --frozen-lockfile` | PASS；移除舊版專用圖示依賴後 frozen install，50 packages；未更新其他依賴版本 |
| `pnpm test` | PASS；214 v2 assertions；舊版專用 tests 已移除 |
| `pnpm build` | PASS；vue-tsc + Vite production build |
| `git diff --check` | PASS |
| Production base path | PASS；production assets HTTP 200、direct route / reload |
| `pnpm test:v2:browser` | PASS；27 viewport/surface rows、20 route/accessibility checks、24 visible-consequence observations |

Browser harness 自行啟動 production preview，完整測試可用：

```bash
pnpm build
pnpm exec playwright install chromium
pnpm test:v2:browser
```

本機使用已有 Chromium binary，以 `CHROMIUM_EXECUTABLE_PATH` 指定；這是實際瀏覽器操作，不以 jsdom 或 mock DOM 代替。`.github/workflows/v2-qa.yml` 已加入 browser install / QA / artifacts，線上執行結果仍須另查。

## Browser QA matrix

實測 Chromium `152.0.7977.8`，對上述 QA implementation HEAD 執行完整 production browser harness。

| 尺寸 | Unit 1–8：所有 stages / controls / Transfer | Final：所有 stages / controls / Transfer | 水平 overflow |
| --- | --- | --- | --- |
| Desktop：1280×800 | PASS | PASS | 無；PASS |
| Narrow desktop：900×700 | PASS | PASS | 無；PASS |
| Mobile：390×844 | PASS | PASS | 無；PASS |

27 組 surface 檢查均通過。每個 Unit 在每個尺寸各改主要參數一次，共 24 次直接觀察 node / edge consequence；所有 controls 另外逐一操作。

20 項 route / accessibility checks 包含 landing、8 個 direct unit routes、reload、unknown route、back / forward、restart / reset、stage persistence、progressive controls、keyboard Tab / Enter、focus、accessible names、reduced-motion、invalid query fallback、GitHub Pages base path、根入口與全部舊 route 轉向，以及 Teaching / Transfer isolation、constraint revisit、Final cumulative incidents、drag/select、tool triage / fix / rescan。

原生鍵盤補充證據來自移除前的 `34678af`（本次未重跑原生 UI 操作）：在 Codex 原生 In-app Browser 實際以 Space / Down / Return 操作 Unit 1–8 與 Final，共 9 個主要控制 PASS。自動化 ArrowDown 對 macOS 原生 select 的輸入方式曾失敗，改用原生 UI 操作後確認控制可用；此限制不當作產品 failure。

可追溯報告：[learning-map-v2-technical-qa.json](qa/learning-map-v2-technical-qa.json)。66 張本機截圖保留於 `output/playwright/v2/`，報告記錄 SHA-256；截圖不入 Git。本次圖面 spot check：Desktop Unit 1、Mobile Unit 3；未見樣式移除造成閱讀或操作阻擋。Final 後段控制較多，需要垂直捲動，沒有水平溢出或阻擋操作。

QA HEAD 是受測程式版本；後續 commit 僅保存本文件與 QA 報告，不改受測程式。

## 舊版完整移除

本次新指示取代先前「保留 legacy」要求；不改 confirmed v2 Curriculum 或 Canonical Content。

- 刪除 `src/content/`、`src/labs/`、`src/components/`、`src/composables/` 的全部舊版實作，包括個人進度／筆記儲存程式。
- 刪除 5 個舊版專用 model／browser tests、2 張舊插圖與過時 `design-qa.md`。
- 移除入口「開啟舊版教材」、舊 route components、舊樣式與 `@phosphor-icons/vue`；保留 v2 使用的基本 reset／字型／skip link 樣式。
- README 與 HTML metadata 改為八章 v2；Pages workflow 的 tests／browser artifacts 改用 v2。
- 既有使用者瀏覽器中的舊 localStorage 資料未讀取、搬移或刪除；本 repo 不再有存取舊學習紀錄的程式。
- Dependency 更新過程的 offline metadata resolution 失敗；保留原 lockfile 版本，僅移除圖示 package 記錄，frozen install 在可連線環境通過。sandbox 與一般 pnpm store 不同，測試／build／browser 在同一安裝環境完成。

## 修正 findings

1. 第一版只有文字 Transfer → 獨立可操作情境與初始狀態。
2. 控制一次全部顯示／先露 terminology → teaching stages、progressive controls、延後術語與界線。
3. 不生效的 serviceScope／過少模型分支 → 補 service、batch、context、normal input、secret lifecycle、evidence／recovery 分支。
4. 沒有 before/after → 可重設比較起點，變動 node 顯示原本 consequence；修正 reactive state 快照處理。
5. 只有 state cards → spatial wires／edge paths、blocked/active state、propagation、reduced-motion 靜態等效。
6. 每次再訪 constraint 都覆蓋 learner 設定 → constraint 只初次注入，再訪保留。
7. Teaching／Transfer 互相污染 → URL 中分開 simulation states，reload／返回可重建。
8. Final 缺失／事件可能隨返回消失 → 獨立 route，累積注入與持續 system state。
9. Scanner 綠燈與 coverage 易混淆 → TP/fixture/miss、side-effect tests、background coverage gap。
10. Restore／rollback 被混成 recovery → 分開 content／credential／data trust，恢復 gate 逐項查核。
11. Toggle hover 對比與動畫快照可讀性 → 對比修正、穩定狀態截圖；essential consequence 不只存在動畫。
12. Unknown unit silently 顯示 Unit 1 → 明確 redirect 至 v2 landing。
13. Final 正常公開讀取與失守路徑標示混淆 → 公開讀取保持正常資料流，跨 owner request、compromised worker／runtime 明確標成事件路徑；沒有 active attack path 不表示合法工作不能完成。

## Remaining findings / NOT TESTED

- 真實 Semgrep execution：NOT TESTED，按已授權策略使用明示 synthetic model；不阻擋本課的基本 finding / triage / fix / rescan 學習。
- 熟悉專案 domain 選擇只提供合成架構遷移，不讀取或驗證真實專案資料；需 learner 與 AI 另建實際 architecture／requirements。
- Safari／Firefox／實體手機／screen-reader 完整稽核：NOT TESTED；已驗證 Chromium 三尺寸、原生控制名稱、鍵盤與 focus，不能等同跨瀏覽器／完整 assistive-technology acceptance。
- 線上 GitHub Actions／實際 GitHub Pages deployment：NOT TESTED；本機 production build 與相同 base path 實測另列。未 push／merge／deploy。
- Human Learning Review／真人理解與 transfer 成效：NOT TESTED。Technical QA 不等於 learning effectiveness PASS。

以上 findings 不阻擋真人開始完整學習。正式判定：**Technical QA PASS WITH FINDINGS；Ready for Human Learning Review**。到此停止；未 merge main，未宣稱學習效果 PASS。
