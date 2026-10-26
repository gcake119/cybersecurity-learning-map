# Cybersecurity Learning Map Mint CI遷移

## 決策、範圍與所有權

排除十四repo後按最新實際Actions job選cybersecurity-learning-map，原Pages39399526039於台北2026-10-20 17:16:58開始。flow-radar是Windows、profile動畫非CI、LoreForge三jobs為macOS，均不遷至Linux。source main121dedd06d692eff3fd6b3f8fdb6fd9d8d2ea060、runner清單空，原Pages位址https://gcake119.github.io/cybersecurity-learning-map/。

使用者於2026-10-26明確選擇「保留自動部署，允許本輪既有Pages發布」。只保留本repo原發布，不擴張其他repo／GHCR／provider或Spectra archive。PRODUCT.md／DESIGN.md的synthetic教學、無私人學習紀錄與Technical QA≠Human Learning Review界線維持；不改app/model/tests/design內容，無產品規範或新ADR。

- home-infrastructure：固定repo runner installer、ci-runner/rootless/原template、共享額度與固定鎖、獨立review／普通merge／真正main控制驗收。
- cybersecurity-learning-map：Pages build與V2 QA改可信Mint/fork hosted，保留Node24/pnpm11.19 frozenlock、原pnpm build／test／完整test:browser及每條模型／互動／視窗／contrast斷言。Mint只安裝鎖定browser binary、無sudo；hosted fork保留--with-deps。
- Pages `deploy` job仍GitHub-hosted與github-pages environment，新增needs完整build（包含全部tests）及exact SHA/artifact ID核對。原main push、workflow_dispatch、pages concurrency及artifact名保留；手動原可選branch/ref的行為不改。只有hosted deploy拿pages:write/id-token:write，Mint contents:read。
- main普通merge後實際發布，核對完整CI、部署收據、GitHub deployment state及公開HTML/asset bytes。候選只跑原V2 QA不發布；無人類學習成效、跨瀏覽器或physical mobile驗收宣稱。

全部runner/rootless共用300%/MemoryHigh16GiB/Max20GiB/Tasks4096，UID995/GID984、無sudo/rootful/backup。heavy/light各一，Docker鎖inode保留；run install/build/tests/browser heavy、控制/收據light，setup/upload不宣稱受slot限制。job60分鐘容納有界等待，Pages／QA browser各1200s並TERM後30s KILL，原Playwright assert/default期限不改。browser cache每repo、pnpm工具/store每job獨立。

## 必要檢查與待取得證據

本機pnpm build、原pnpm test（214 model assertions＋navigation/isolation/transfer）成功。Playwright1.63 Chromium v1243依ubuntu24.04 fallback盤點系統依賴全安裝，不加APT套件；原完整三viewport browser QA已通過：27surface rows、20route/accessibility、24interaction、9885contrast/state samples，以及3viewport course QA，兩份report errors皆空。必要檢查另含actionlint/bash/python、shared9tests、negative4shell、獨立source/host/sudo wrapper review、候選/真正main與原掃描全部checks。

新CI receipt只記SHA/tree/runner、原browser reports的27surface／24interaction／3course viewport與實際route/contrast數，以及dist逐檔SHA256；不修改網站dist內容。PR不發布，Pages收據只在原deploy成功後寫，Technical QA不是Human Learning Review。安裝與平台結果pending，不預先宣稱成功。原dirty內容保留，全部新隔離checkout。

## 候選執行預算診斷

首輪完整候選40303048797在本輪新增720秒外層上限退出124，當下dragTo尚未完成，沒有成功收據。未刪改原測試；隔離手動診斷分支原樣抽出全新reduced-motion context尾段，僅diagnostic-only不進main／不取代完整QA。[40309803468](https://github.com/gcake119/cybersecurity-learning-map/actions/runs/40309803468)在同Mint以原native drag與所有尾段斷言成功，尾段8.703秒。先前40306608380 attempt1只是heavy等待900秒exit75、未執行測試；只讀40309193095確認名額由另一個有效sim-sik-frontend CI持有，未干預該工作。

本輪新增的外層總預算統一為1200秒並保留TERM後30秒KILL，記錄實際完整時間；原Playwright action/assert期限、全部產品與測試、retry/skip、共享資源額度均不改。尾段成功僅排除必然失敗，仍以新候選完整QA、真正main與實際Pages公開逐檔驗收作最終門檻。
