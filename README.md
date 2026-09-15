# 資安學習地圖

九階段地圖與 16 頁互動簡報。暖白網格、低彩度分類色，完整路徑與 Web 開發者優先路徑；手機直向布局，鍵盤與左右滑動導覽。

## 執行

本專案使用原生 ES modules / CSS / HTML，不依賴 CDN、後端或 npm 安裝。相對資產路徑與 hash 導覽相容 GitHub Pages 子目錄。

```sh
python3 -m http.server 8000
```

開啟 http://localhost:8000 。不能以 file:// 直接開啟 ES modules。

## 內容維護

- `content.js`：九階段與 16 頁的內容、練習和官方參考連結。
- `app.js`：路由、地圖、簡報、localStorage 進度。進度僅屬於本瀏覽器，可取消標記或重設。
- `style.css`：共享設計系統與響應式布局。
- `.github/workflows/pages.yml`：main 更新時直接上傳五個靜態資產，不需 npm build。

如果首次工作流程不能啟用 Pages，請在 Settings → Pages → Build and deployment → Source 選擇 GitHub Actions，再重新執行工作流程。一般 GITHUB_TOKEN 不保證具備首次啟用 Pages 的管理權限。

## 編輯原則

主題為 Cybersecurity，不混入 Agent System Design。所有階段開放閱讀；編號是建議順序，不代表嚴格先備依賴。Bug、弱點、漏洞、威脅與風險不描述成必然線性鏈；CVSS 與 EPSS 不當作個別部署的完整風險分數。練習限自有測試環境或授權靶場。內容是自主整理的學習路徑，不是飛飛課程的官方教材。

參考來源：FIRST EPSS、MITRE CWE、MDN HTTP、OpenSSH、curl、OWASP WSTG / ASVS / SAMM、PortSwigger Academy；各頁附對應官方連結。
