# 資安學習地圖

Vue 3 + TypeScript + Vite + pnpm 的互動課程，部署至 GitHub Pages。

## 課程結構

核心問題：如何判斷自己的 Web 系統有沒有保護重要資料與操作？

| 章 | 單元 |
|---|---|
| 說清楚要保護什麼 | 1 從後果寫出安全需求；2 沿資料流找出信任邊界；3 依情境決定修補順序 |
| 把保護放進系統 | 4 逐次檢查身分與資源權限；5 讓外部輸入保持資料身分；6 讓每條需求都有實作位置 |
| 用證據確認保護有效 | 7 確認驗證環境與日誌來源；8 改變一個條件，留下對照證據；9 把安全保證留下來持續驗證 |

每單元包含問題、核心結論、兩項學習目標、三段觀念教學、操作路線、互動模型、兩項判斷檢核、專案應用筆記及限制。以案件管理系統作為共同案例，不提供純簡報模式。

操作可返回觀念或檢核，切換階段保留當次實驗條件、結果、答案。離開單元後實驗和答案重設；筆記與完成紀錄保留於本機瀏覽器。筆記可匯出 Markdown。

完成需同時具備指定對照、兩項正確判斷、至少 20 字筆記。筆記只檢查填寫長度，**不自動判定語意正確性**。新進度 key 為 `security-course-progress-v3`，不把舊實驗進度認定為新課程完成。清除完成紀錄保留筆記。

## 開發與測試

Node.js 22.12+；pnpm 11.19.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

GitHub Actions 執行建置與瀏覽器測試後才部署，Pages Source 為 GitHub Actions。測試涵蓋三章順序、九個模型、對照與理解檢核完成條件、筆記保留、桌面與手機、舊路由、儲存失效。

## 維護

- `src/content/curriculum.ts`：三章九單元及學習目標、觀念、操作路線、檢核與應用。
- `src/labs/model.ts`：九個模擬及實驗證據條件。全部本機執行，無真實 Shell、SQL、SSH 或外部 API。
- `src/components/LabView.vue`：學習階段、實驗、檢核與筆記。
- `src/components/LearningMap.vue`：依章節展示單元；使用穩定 ID 保留既有深層連結。
- `src/content/learning.ts`：保留舊簡報路由映射，非目前課程內容來源。

顯示單元順序的穩定 ID 為 `[0,7,1,3,4,6,2,5,8]`。不要直接重排 labs 陣列以免破壞舊 `/lab/:id`、`/learn/:id`、`/slide/:id` 連結。
