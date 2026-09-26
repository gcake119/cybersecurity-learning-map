# 資安學習地圖

AI-assisted Security Engineering 互動課程。以 Vue 3、TypeScript、Vite 與 pnpm 實作，使用 deterministic synthetic 教學模型，不執行真實攻擊或產生安全分數。

入口：`#/v2`。舊版教材、元件、模型、進度儲存、圖片與專用測試已移除；根入口與所有舊網址導向新版入口，不將舊單元編號映射成不同的新單元。

## 課程結構

1. 安全目標與需求。
2. 威脅與情境風險。
3. 信任與授權。
4. 輸入與解讀邊界。
5. 最小權限與影響範圍。
6. 資料、憑證與軟體供應鏈。
7. 驗證工具、finding 判讀與 detection。
8. containment 與 recovery。

Final Integrated Transfer：`#/v2/final`，在同一個合成 collaboration SaaS 裡逐步注入五種 changes／incidents，整合推理與處置。

操作包含漸進控制、節點與連線後果、前後比較、術語後揭露與獨立 Transfer。URL 保存可重建的當前模擬狀態；不保存個人學習紀錄或完成分數。Unit 7 使用明示的 synthetic Semgrep-like 模型，與真實 Semgrep 結果分開。

## 使用方式：直接學習或 Fork 成自己的教材

這份公開教材可以直接使用，不需要先安裝 `learning-map` Skill，也不需要建立個人學習紀錄。

如果希望讓 Agent 根據自己的學習狀況持續調整教材，可以 Fork 本 repo，搭配：

- `learning-map` Skill：提供課綱、教材內容、互動設計與 Learning Handoff 的共用方法。
- 自己的 private Learning Handoff：保存目前學習位置、學習證據、回饋、待確認問題與 Learner Path。

概念上：

```text
本公開教材
    ↓ Fork
自己的教材 fork
    ↑
learning-map
    ↑
private Learning Handoff
```

Agent 可以同時讀取教材 fork 與私人 Learning Handoff，再依實際學習狀況修改自己的教材版本，例如增加補充案例、改寫說明、加入額外練習、略過已熟悉內容或調整學習路線。

**不要把私人 Learning Handoff、個人學習紀錄或 Agent 對個人的暫時判斷 commit 到公開 fork。** 個人紀錄應保存在 private repo、本機私人檔案或其他適當的私人儲存。

如果某項修改後來確認是一般學習者都可能受益的教材改善，可以先去除個人資訊，再整理成 issue 或 pull request 回饋本 repo。

`learning-map`：https://github.com/gcake119/learning-map

## 開發與測試

Node.js 22.12+；pnpm 11.19.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

瀏覽器測試會自行啟動 production preview，驗證三種尺寸、八章所有階段與控制、Transfer、Final、路由與可及性。可用 `CHROMIUM_EXECUTABLE_PATH` 指定既有 Chromium。

## 維護

- `docs/curriculum-proposal.md`：confirmed Curriculum。
- `docs/canonical/`：Canonical Content 與跨單元 review。
- `docs/interaction-storyboard.md`、`docs/learning-copy.md`：互動與文案依據。
- `src/v2/course.ts`：階段、控制與 Transfer metadata。
- `src/v2/model.ts`、`src/v2/final-model.ts`：pure deterministic synthetic models。
- `tests/v2-model.mjs`、`tests/v2-browser.mjs`：模型與完整瀏覽器 QA。
- `docs/implementation-v2.md`：Technical QA、實測範圍與尚未驗證的限制。

Technical QA 通過不代表真人學習效果已通過。公開 repo 不存放私人 Learning Handoff。
