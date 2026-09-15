# 資安學習地圖

Vue 3 + TypeScript + Vite 的九階段地圖與 16 頁互動簡報。採用冷白／淺藍底、深藍文字與立體技術圖示。支援完整與 Web 開發者優先路徑、鍵盤及手機滑動導覽。

## 開發與驗證

需要 Node.js 22.12+ 與 pnpm 11.19.0（packageManager 已鎖定版本）。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

`build` 先以 vue-tsc 檢查 TypeScript 與 Vue 模板，再由 Vite 產生 dist。瀏覽器測試使用 production preview，檢查桌機／手機的全部簡報、路由、鍵盤、進度保留、重設與 storage 不可用情境，並留下截圖。

## 元件與內容

- `src/App.vue`：頁首、觀看模式、路由容器。
- `src/components/LearningMap.vue`、`MapNode.vue`：地圖及優先路徑。
- `src/components/SlideView.vue`：概念點選與練習展開。
- `src/components/HttpLesson.vue`：HTTP 封包播放、Request／Response 切換及伺服器檢查說明。
- `src/components/UiIcon.vue`：共用 Phosphor 圖示。
- `public/assets/`：淺銀藍色筆電與伺服器 WebP 插圖。
- `src/components/PhaseDetail.vue`：共用學習目標與練習。
- `src/components/ProgressFooter.vue`、`src/composables/useProgress.ts`：進度顯示與儲存。
- `src/content/learning.ts`：有型別的 Phase / Slide、九階段及 16 頁內容、官方來源。
- `src/style.css`：共享設計樣式與響應式布局。

Vue Router 使用 hash history，保留 `#/map/0`、`#/slide/6` 等原有網址。localStorage 沿用 `security-progress-v1`，舊版進度可繼續使用，只儲存於此瀏覽器。無後端、無追蹤分析、無 CDN 執行期依賴。

## GitHub Pages

Source 設為 GitHub Actions。main 更新後執行 pnpm install --frozen-lockfile、型別檢查、建置與瀏覽器測試，通過才將 dist 部署至 Pages。Vite base 為 `/cybersecurity-learning-map/`。更改 repo 名稱時需同步調整 base 與測試網址。

## 內容原則

主題是 Cybersecurity。所有階段開放閱讀；編號代表建議順序，不代表嚴格先備依賴。Bug、弱點、漏洞、威脅與風險不描述成必然線性鏈；CVSS 與 EPSS 不當作個別部署的完整風險分數。練習限自有測試環境或授權靶場。本網站是自主整理的學習路徑，不是飛飛課程的官方教材。

各頁附 FIRST、MITRE、MDN、OpenSSH、curl、OWASP 或 PortSwigger 的官方參考連結。
