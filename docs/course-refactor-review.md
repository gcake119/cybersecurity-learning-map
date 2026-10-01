# Course Refactor Review

日期：2026-10-02。起點：`8b2566c`。分支：`codex/course-refactor-baseline`。
Method authority：learning-map main `9e62bb7`。Interaction reference：system-design-simulator `a212e371`。

## Scope and gates

既有八章逐層 review，保留 highest-level AI-assisted Security Engineering outcome。使用者已委託範圍內課綱與實作決策、commit／push；不 merge／deploy。

| Gate | 結果 |
| --- | --- |
| Source／learner baseline／scope | PASS WITH SOURCE LIMITATION：沒有 Learning Handoff／已掌握證據；保守補先備。CISA live fetch 403，使用 FIRST 交叉支持既有語意 |
| Curriculum | PASS：保留八種不同推理，U5 改為問題式名稱；一般開發操作只銜接，不新增 Unit |
| Canonical／content review | PASS WITH SOURCE LIMITATION：每章補 prerequisites，U5–U8 補術語定義；未增加來源邊界外主題 |
| Mixed-mode storyboard／copy | PASS：29 個 teaching stages 以 INTERACT／PRACTICE＋必要 READ；八章 Transfer 與 Final 分開 |
| Technical QA | PASS WITH FINDINGS：完整本機 gate 已實測；見下列矩陣與 NOT TESTED |
| Human Learning Review | NOT TESTED |

Baseline 與 scope 完整表見 `curriculum-proposal.md` 第 13 節。公開 repo 只記去識別化受眾假設，不存私人學習紀錄。

## Changes and resolved findings

| 分類 | Finding | 修正／依據 |
| --- | --- | --- |
| BLOCKER | Codebase Memory 初次索引被拒絕 | 使用者在本對話明確授權兩 repo 後，索引成功；沒有繞過審核 |
| CURRICULUM | 沒有明確 baseline／scope；角色知識被當作已會 | 保守分類與 short bridge；沒有證據支持刪除資安章節 |
| SUBJECT-MATTER | U5–U8 required terminology 只有名稱 | 補白話定義、prerequisites；核對官方來源並保留既有 qualification |
| LEARNING UX | 過度依賴術語 reveal，沒有直接可讀的完整 mechanism | 29 段必要 READ，每段兩段正文、觀察方向與來源；原 reveal 僅作摘要 |
| LEARNING UX | Final domain 原只改名稱 | 案件／自動發文合成需求改變分享規則、目標與工作能力／產物條件；實際專案仍需另建架構 |
| IMPLEMENTATION | 直接後段 route 沒套用初始 constraint | resolveLesson 重建初始約束；有保存 state 時保留 learner revision；Transfer stage／mode 一致；enum fallback |
| IMPLEMENTATION | 直接 entry 返回再訪可能覆蓋設定 | visited state 含原 entry，revisit 保留修改；browser reload／revisit 實測 |
| IMPLEMENTATION | API 隔離後 DB 還顯示該 API 的越界讀取 | node 使用 active request 條件，與 blocked edge 一致；失守 Worker／runtime 路徑仍獨立計算 |
| IMPLEMENTATION | 缺持續章節導航與 code copy | desktop sidebar、窄版可展開章節、current page／stage、focus、實際剪貼簿成功／拒絕提示 |
| IMPLEMENTATION | QA 初次 preview 無法啟動；新增 harness 用 4190 被 Node fetch 阻擋 | 允許本機 server 的執行環境；4191 取代受限埠。未把 harness 問題宣稱產品 PASS |

## Technical architecture

- `course.ts`：原單元／控制／階段資料。
- `reading.ts`：源於 canonical 的正文與 mode，view 不負責生成教學內容。
- `model.ts`／`final-model.ts`：純 deterministic synthetic 教學關係；不執行攻擊／scanner。
- `navigation.ts`：可測的直接入口與保存 state 重建，不新增 private progress storage。
- `CourseNavigation.vue`／`CodeBlock.vue`：可重用導覽與實際 copy；Lesson／Final 只負責呈現與操作。
- 既有 CI job 以 `pnpm test:browser` 執行完整瀏覽器入口，artifacts 包含新增 course-refactor 報告；不新增 job、不擴張 push trigger。
- State 保存於本輪 URL；章節 direct entry 從該章起點進入，瀏覽器歷史可回到原 URL。沒有跨裝置私人進度服務。

## Verification

最終候選版本實測環境：macOS arm64、Node 22.23.2、pnpm 11.19.0、Chromium 152.0.7977.8。

| Check | 實際結果 |
| --- | --- |
| Frozen install | PASS |
| pnpm test | PASS：214 model assertions＋direct route／isolation／Transfer suites；拆分測試後再次通過 |
| pnpm build | PASS：vue-tsc＋Vite |
| pnpm test:browser | PASS：27 viewport／surface rows、20 route／accessibility checks、24 main-parameter consequence checks、9,885 rendered contrast／state samples＋3 新 course-interface rows |
| Desktop 1280×800 | PASS：八章／Final、stage／control／Transfer、READ、chapter keyboard、real clipboard、no horizontal overflow |
| Narrow 900×700 | PASS：同上，章節折疊／展開 |
| Mobile 390×844 | PASS：同上，單欄閱讀與操作 |
| Direct route／reload／production base | PASS：`/cybersecurity-learning-map/` assets 與 hash routes；constraint 與保存 state 一致 |
| Back／next／restart／persistence／progressive disclosure | PASS：原完整 harness＋新 direct entry／revisit regression |
| Reduced motion／keyboard／focus | PASS：原靜態 graph 等效、stage focus，加 chapter 與 copy keyboard 檢查 |
| git diff --check | PASS |

可追溯摘要：`qa/course-refactor-technical-qa.json`，含候選 code SHA-256 與 screenshot SHA-256。完整本機 reports 在 ignored `output/playwright/v2/` 與 `output/playwright/course-refactor/`；不把 screenshots 或個人紀錄提交。

此 QA 實測當時未 commit 的候選版本；受測 code hashes 已逐檔核對與程式 commit `c6dd380` 一致。後續 commit 僅保存 QA 與文件，不以 commit 本身當測試證據。
測試先重現直接 route `api !== batch`、Transfer 缺實際需求變化，以及 isolation 後 DB 後果不一致，再做修正。

既有 214 model assertions 涵蓋每個重要控制的適用情境與錯誤控制界線；新增 direct route／Transfer／isolated request 因果測試。Browser 除現有完整 harness，另加入 chapter keyboard、current、focus、必要 READ、真實 clipboard、direct constraint、reload／revisit、Transfer requirement change 三尺寸檢查。

Visual spot check：desktop U5 graph／READ／sidebar；mobile U7 READ／code copy。檢查 typography、圖面、正文與 code，不把 screenshot 當真人理解證據。

## NOT TESTED / remaining findings

- Safari／Firefox、實體手機、screen-reader 完整稽核、作業系統 select popup。
- Clipboard 被瀏覽器／作業系統拒絕的真實環境；UI 有手動複製提示，但不得推測此分支已實測。
- 真實 Semgrep／provider／production 系統；本課明示 synthetic。
- 線上 GitHub Actions、正式 GitHub Pages deployment；本機 production base path 與正式部署分開。
- 真人理解、術語時機、READ 是否足夠、Final 操作密度與實際專案遷移成效。

以上為透明驗證邊界，沒有剩餘 implementation blocker。**Technical QA：PASS WITH FINDINGS；Ready for Human Learning Review：YES。** Human Learning Review 尚未執行。

## Human Learning Review protocol

請真人選 U3、U4、U6、U8 的一段完整 learning loop，記錄：

1. 沒有看名稱摘要時，能否指出剛改的條件與圖上後果？
2. 讀完 READ 後，能否說明 cause → effect，並指出控制不能保護的情況？
3. 是否有術語首次出現仍不懂、哪個 prerequisite 需要補？
4. Transfer 換需求後，能否自行提出控制與查證方式，而不是重用教學答案？
5. Final 能否分開處理身分、runtime、資料與恢復證據，保留未知？

沒有正確率分數或完成鎖。個人證據／回饋先記 private handoff；可重用的教材問題去識別化後才更新公開 course。真人 review 之前不宣稱 learning effectiveness PASS。

## Decision-context check before commit

Level 2（持久 course UI contract）。沒有 docs/decisions index 或 ADR；依 repo README、PRODUCT、DESIGN、既有 curriculum／canonical 與近期 commits 讀取 fallback。

本次符合明示 synthetic、去識別化、no score、Teaching／Transfer 分離、色彩成對、可測因果與證據層分開的既有決策。新增章節與 READ／copy 持久規範已同步 DESIGN／PRODUCT，課綱與文案同步 docs。無需另造 ledger／ADR 或 Spectra archive。Commit 範圍只包含本次 refactor 與驗證文件。
