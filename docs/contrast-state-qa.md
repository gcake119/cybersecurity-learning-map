# v2 互動元件對比與狀態 QA

日期：2026-09-26。程式與 browser harness 的受測 commit：`365107ec7eda306e42259ebe36c67ea40ff513ac`。後續 commit 僅保存規範補充與 QA 紀錄，不變更受測實作。基底：`9744031d6c34c1950225cae358cfa2e991e6d29d`；確認 origin/main 未前進，原 repo 工作目錄乾淨。隔離分支：`codex/fix-control-contrast`。

**PASS WITH FINDINGS**，限 presentation 的可讀性／狀態回歸；不等於真人學習效果或正式部署驗收。

## 根因與修正

原 `.v2-landing a` 的 specificity（CSS 選擇器優先權）為 `(0,1,1)`，高於 `.v2-start` 的 `(0,1,0)`；因此連結 `color:inherit` 蓋過 CTA 白字規則，繼承頁面深色文字。Chromium production build 確認 foreground `#183339`、background `#184e4e`，對比 **1.425：1**。新增測試在原始 build 實際失敗，證明可抓到此回歸。

修正改用低優先權的頁面連結預設，並成對指定控制 foreground／background。CTA 改為 `#f6f8f2` 配 `#184e4e`，default 實測 **8.768：1**；hover／active 保留淺字配較深背景。一般控制、selected stage、toggle 開／關、停用及焦點共用狀態規範。移除舊的分散 hover 補丁，沒有新增 color 的 !important。

本機回歸亦發現第一次候選 disabled-hover 被一般 hover 蓋過；降低基礎控制 selector 優先權後，停用文字／背景在 hover 保持不變。停用改用清楚文字與虛線邊界，opacity 1。控制邊界加深，焦點框改用足夠對比的橙棕色。

## 持久規範與範圍

- 根目錄 DESIGN.md：foreground／background tokens、default／hover／active／focus／disabled／selected 矩陣、文字至少 4.5：1、邊界與焦點至少 3：1、CSS 優先權規則。
- PRODUCT.md：由 README、learning-copy 與 implementation-v2 萃取既有產品邊界，不重新發明課程或品牌。
- .impeccable/design.json：供設計工具預覽的元件附檔，不是另一套產品樣式來源。
- src/v2/v2.css：首頁 CTA、一般按鈕、toggle、stage navigation、select、課程連結、一般導覽與 summary；同一 stylesheet 涵蓋 Unit 1–8、Transfer、Final。
- tests/v2-contrast.mjs 與 browser harness：讀真實 computed colors、祖先背景、子文字、opacity，操作 hover、真實 pointer active、keyboard focus-visible，逐階段與改控制前後檢查。selected 由真實 aria 狀態驗證，不建立假 DOM。
- V2 QA workflow 新增對 main 的 pull_request trigger，只執行 QA；Pages workflow 保持 main-only，未觸發部署。

課綱、Canonical Content、模型、Vue 互動邏輯、URL simulation state 與 only-v2 結構沒有變更，也沒有新增私人學習紀錄。

決策檢查：repo 無 DESIGN.md／PRODUCT.md／decision ledger，依既有 implementation-v2、learning-copy 與 README 進行授權範圍內的持久元件規範補齊；無新增架構決策，無需 ADR 或 Spectra archive backfill。全域 open-slide 指南與本 Vue 教材修正無關。

## 完整本機驗證

macOS arm64，Node 22.23.2，pnpm 11.19.0，真實 Chromium 152.0.7977.8。使用既有 binary，由 CHROMIUM_EXECUTABLE_PATH 指定；production preview 採正式相同的 `/cybersecurity-learning-map/` base path。

| 檢查 | 結果 |
| --- | --- |
| pnpm install --frozen-lockfile | PASS，50 packages，lockfile 與依賴版本未變更 |
| pnpm test | PASS，214 model assertions |
| pnpm build | PASS，vue-tsc 與 Vite |
| pnpm test:browser | PASS，27 viewport／surface rows、20 route／accessibility checks、24 可見後果 observations |
| rendered contrast／state | PASS，9532 samples，最低文字 6.238：1；最低 focus 5.452：1 |
| git diff --check | PASS |
| 原錯誤的回歸測試 | EXPECTED FAIL，CTA 1.425：1 |

每個尺寸都測首頁（含展開課程清單）、八章的 29 teaching stages 與 8 Transfer、Final 6 階段；原有參數操作、重設、比較、路由、拖曳等效選单、reduced-motion 及 only-v2 fallback 回歸保留。檢查 default／selected／hover／active／focus／disabled／disabled-hover；同一元件／語意狀態的深度 pointer／keyboard 操作在每個 surface／viewport 去重，所有階段仍讀取實際 default／selected 顏色。

| 尺寸 | 色彩／狀態 samples | 最低文字對比 | 最低 focus 對比 | 水平 overflow |
| --- | --- | --- | --- | --- |
| desktop | 3143 | 6.238：1 | 5.452：1 | PASS |
| narrow | 3143 | 6.238：1 | 5.452：1 | PASS |
| mobile | 3143 | 6.238：1 | 5.452：1 | PASS |
| reduced-motion | 103 | 8.768：1 | 5.452：1 | PASS |

reduced-motion 額外檢查為 1280×800 的 Unit 7；不能當作第四種 viewport 或全課 reduced-motion 對比矩陣。

## 畫面與量測證據

[contrast-state-qa.json](qa/contrast-state-qa.json) 保存 matrix、對比摘要、CTA 各狀態、程式 SHA-256 與 81 張自動截圖 SHA-256。完整 9532 筆原始量測為 `output/playwright/v2/report.json`，和截圖保留於本機／CI artifacts，不把大型截圖與完整量測加入 Git。

首頁三尺寸各有 default／hover／active／focus、展開清單截圖；八章各有 Transfer 與 comparison；Final 各階段也有實際截圖。另以獨立 Chromium context 補充三尺寸的 Unit 3 toggle 開／關、hover／按住／focus、disabled 與 selected-stage hover，共 30 張，保存於本 task outputs/control-states。

本次視覺 spot check：Desktop 首頁 default／focus、Desktop Unit 3 Transfer、Mobile Unit 3 toggle on、Mobile 首頁、Narrow Final、Mobile Final。檢查文字、選取、焦點框與窄螢幕換行；未見互動控制閱讀阻擋。Final 後段仍需要垂直捲動。

## Remaining findings／NOT TESTED

- Safari／Firefox／實體手機／完整 screen-reader audit：NOT TESTED。Chromium viewport 是真實瀏覽器模擬尺寸，不等於實體手機。
- OS 原生 select 展開 popup 的顏色與 active／open state：NOT TESTED。關閉狀態／選中值／hover／focus 與 selectOption 操作已測。當前沒有 disabled select 或 disabled link，不虛構測試覆蓋。
- 真人學習效果、真實 Semgrep／真實專案安全性：NOT TESTED。synthetic 邊界保持不變。
- 新版本 main 合併與 GitHub Pages 部署：NOT TESTED，沒有授權執行。GitHub Actions 的當前結果以 PR checks 另行記錄，不由本機 PASS 推定。

自動核准審查拒絕重新建立 codebase-memory 索引，理由是可能傳送原始碼到未受信任的 MCP 服務。已採本機檔案讀取完成修正，沒有外傳索引；不是產品 finding，也不影響本機 QA。
