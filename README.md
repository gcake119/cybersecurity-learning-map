# 資安學習地圖

Vue 3 + TypeScript + Vite + pnpm。九個階段各有可執行的情境模型；操作條件會改變輸出資料、處理路徑或測試結果。不提供純簡報模式。

## 九個實驗

| 階段 | 操作與可觀察結果 |
|---|---|
| CIA | 切換外洩、竄改、中斷與存取控制，比較資料和服務狀態 |
| 漏洞資訊 | 調整暴露、KEV、EPSS 和業務重要性，觀察修補順序 |
| Linux / SSH | 在本機與虛擬 VM 執行相同唯讀指令，比較輸出 |
| HTTP | 切換帳號、資源、UI/API 入口與權限檢查，觀察 200/401/403 和回傳資料 |
| Web Security | 比較拼接與參數化查詢對同一測試輸入的回傳筆數 |
| 攻擊實驗 | 固定 Session，修改案件 ID、重送、修補，再比較證據 |
| Secure Development | 配置歸屬、狀態、日誌規則，執行四項驗收 |
| Threat Modeling | 在資料流邊界配置保護，觀察指定威脅在哪裡被攔截 |
| Security Engineering | 注入缺陷並選擇測試，觀察 CI 放行、漏檢或阻擋 |

每個實驗都有：任務、可編輯條件、執行按鈕、結果與處理路徑、最近兩次比較、模型範圍及原始參考連結。變更輸入後明確提示結果過期，必須重新執行。所有資料及命令皆在瀏覽器內模擬，沒有後端、外部 API 請求或真實 Shell / SQL 執行。

## 開發與驗證

Node.js 22.12+；pnpm 11.19.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

瀏覽器測試逐一檢查九個模型的反例與保護結果，包括資料回傳、查詢筆數、排序、錯誤邊界、CI 漏檢；另驗證前後比較、完成證據、路由、桌面／手機與儲存失效情境。不是只檢查卡片數量。

## 結構與相容性

- `src/labs/model.ts`：九個純函式模擬模型、控制項與完成條件。
- `src/components/LabView.vue`：條件編輯、結果快照、執行紀錄與比較。
- `src/components/LearningMap.vue`、`MapNode.vue`、`PhaseDetail.vue`：地圖與實驗入口。
- `src/composables/useProgress.ts`：指定對照完成後自動儲存九個實驗的進度。
- `src/content/learning.ts`：階段資料及舊主題對應；舊簡報元件已移除。
- `src/components/UiIcon.vue`、`src/style.css`：共享圖示與淺色視覺。

主要路由為 `#/map/0`、`#/lab/3`。舊 `#/learn/6` 與 `#/slide/6` 轉到 HTTP 實驗 `#/lab/3`。
新實驗進度使用 `security-lab-progress-v2`，保留舊閱讀進度的儲存資料，但不把閱讀完成當作實驗證據。重新整理保留完成紀錄；執行快照是暫存，不持久化。

## GitHub Pages

**Settings → Pages → Build and deployment → Source 必須選 GitHub Actions。** 分支原始碼部署會發布引用 `/src/main.ts` 的開發入口而造成空白頁。

main 更新後執行 pnpm 安裝、型別檢查、建置與瀏覽器測試，成功才部署 dist。每次重跑使用獨立 artifact 名稱，避免重複名稱導致部署失敗。Vite base 為 `/cybersecurity-learning-map/`。

## 教學範圍

練習是特定案例的簡化模型，不宣稱為真實漏洞掃描、完整 SQL 引擎或風險評分。每個模型在畫面列出限制和來源。完成代表做過指定比較，不代表已熟練或系統全面安全。教材為自主整理，非飛飛課程官方教材。
