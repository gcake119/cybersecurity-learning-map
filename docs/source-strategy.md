# Cybersecurity Learning Map v2 — Source Strategy

> 日期：2026-09-26
> 狀態：Draft for Curriculum Confirmation Gate
> Branch: `learning-map-v2`
>
> 本文件只定義來源角色、適用範圍與使用邊界。來源出現某個分類，不代表新課綱必須照該分類組織。

## 1. Source mode

本次採 **source-informed + open research**。

- 舊版 Cybersecurity Learning Map 是既有教材、案例與互動實作的審查對象，不是 locked curriculum。
- 飛飛（feifei.tw / Kiwissec）是重要的在地初學者教材與 curriculum reference，但不單獨決定課綱。
- Subject-matter claims 優先回到 NIST、OWASP、MITRE、CISA、官方技術文件與大學公開課程。
- PortSwigger 等刻意脆弱靶場主要用於 teaching case / mechanism demonstration；不把攻擊步驟本身當最高層 learning outcome。
- `agent-system-design-learning-map` v2 與 `system-design-simulator` 只支持流程、品質 gate、presentation / interaction patterns，不支持資安 subject-matter claim。

## 2. Source hierarchy

### A. Primary / official subject-matter sources

| Source | Role | 適合支持 | 不適合支持 |
| --- | --- | --- | --- |
| NIST Cybersecurity Framework 2.0 | Subject-matter validation / coverage framework | Govern、Identify、Protect、Detect、Respond、Recover；風險管理生命週期與高層 outcome coverage | 不直接當初學者章節順序；不提供 Web vulnerability mechanism 細節 |
| NIST SP 800-218 SSDF | Secure development framework / validation | 將 security practices 整合進 SDLC、供應鏈與 vulnerability response | 不當作單一程式框架的實作手冊 |
| NIST SP 800-207 Zero Trust Architecture | Trust / access validation | 網路位置不能自動等於可信；資源導向的 authentication / authorization | 不把「Zero Trust」品牌化成所有系統都要採同一架構 |
| OWASP Cheat Sheet Series | Application-security primary reference | Authentication、Authorization、Input Validation、Logging、Cryptography、Secrets、Supply Chain 等應用安全機制 | 不用單一 cheat sheet 支持整體課程範圍 |
| OWASP ASVS / WSTG | Verification / coverage reference | 安全需求、驗證範圍、Web 應用安全檢查 | 不把檢核條目直接轉成課綱 |
| MITRE ATT&CK | Threat / adversary-behavior reference | 攻擊者 tactic / technique、偵測與 response context、攻擊路徑案例 | 不當作初學者核心課綱；不要求背 technique matrix |
| CISA Secure by Design / vulnerability resources | Defensive principles / operational validation | secure defaults、風險處理、已知遭利用漏洞與營運觀點 | 不取代產品／框架的實際安全文件 |

### B. Educational / mechanism sources

| Source | Role | 適合支持 | 不適合支持 |
| --- | --- | --- | --- |
| PortSwigger Web Security Academy | Teaching cases / mechanism labs | Access control、SQLi、XSS、CSRF 等機制與安全靶場觀察 | 不把 exploitation proficiency 當本課最高層能力；不延伸至未授權真實目標 |
| Microsoft Threat Modeling / STRIDE | Threat-modeling educational reference | Data-flow / trust boundary、STRIDE 問題提示、威脅與 mitigation 討論 | STRIDE 不等於完整風險模型，也不必每章都用 |
| MIT Computer Systems Security (OCW) | Advanced subject validation | secure-system design、threat model、privilege separation、mechanism depth | 深度高於本課初學者定位；只抽取必要原理，不照 syllabus 教 |
| Google / Microsoft public security learning resources | Supplemental educational reference | 初學者術語、security fundamentals、role-based learning | 不以廠商產品路徑主導課綱 |

### C. 飛飛 / Kiwissec

| Source | Role | 適合支持 | 不適合支持 |
| --- | --- | --- | --- |
| feifei.tw 品牌故事 / about | Learner-context / pedagogy reference | 初學者友善、實作與社群導向、從零開始的學習脈絡 | 不支持技術 claim |
| 資安學習路徑 / knowledge base | Curriculum coverage reference | 基礎知識、Web security、攻防／防禦／治理等不同學習路線；檢查是否漏掉必要先備 | 網站分類不直接等於本課章節 |
| 資安文章 | Supplemental content reference | 初學者案例、台灣語境與補充說明 | 重要安全機制需以 primary / official source 核實 |
| 個人課程 | Curriculum / audience reference | 完全零基礎常見困難：CIA、漏洞語言、Linux / SSH、HTTP、WAF/IDS/IPS 等 | 商業課程目錄不能單獨支持完整性或技術正確性 |
| Kiwissec 企業課程 | Scope / professional-context reference | SSDLC、治理、Web/OS/AI security 等業界訓練範圍 | 企業課程分類不應讓本課變成職能清單 |

### D. Existing Cybersecurity Learning Map

角色：**legacy course asset / review target**。

目前有三章九單元與 deterministic labs：
1. 從後果寫出安全需求
2. 沿資料流找信任邊界
3. 依情境決定修補順序
4. 身分與資源權限
5. 輸入／解讀邊界
6. 安全要求落到實作位置
7. 驗證環境與日誌來源
8. 單一變因留下證據
9. 持續安全驗證

使用規則：
- 不預設沿用三章九單元；
- 內容須重新對 Subject Model；
- lab 若能清楚呈現 mechanism，可保留概念或重建；
- Linux / SSH、CVE / CVSS / EPSS 等可能改成 prerequisite / supplemental / applied case；
- 不因已有動畫、路由、測試而保留原學習順序。

### E. Process / presentation / interaction references

#### `gcake119/learning-map`
角色：method authority。
支援：Subject Research → Subject Model → Pyramid Curriculum → Curriculum Gate → Canonical Content → Content Reviews → Storyboard → Learning Copy → Implementation → QA → Human Learning Review。

#### `gcake119/agent-system-design-learning-map` branch `learning-map-v2`
角色：**process / quality-gate reference**。
支援：source strategy 格式、curriculum confirmation、claim-level canonical content、unit/cross-unit reviews、learner-copy constraints、v2 branch 與 QA discipline。
不支援：資安課綱、System Design 案例、QPS / simulator model。

#### `gcake119/system-design-simulator` / upstream interaction ideas
角色：presentation / interaction reference。
只借用「控制參數 → state 改變 → consequence 可見 → 比較 trade-off」的互動原則。Cybersecurity 每章可採不同 mechanism model。

## 3. Claim grounding rules

1. Security principle 優先 primary / official source。
2. Teaching simplification 必須標出假設與適用範圍。
3. Product-specific behavior 回到該產品官方文件。
4. Synthetic scenario / deterministic model 明示為教學模型。
5. ATT&CK / CVSS / EPSS / KEV 等資料各回答不同問題，不能互相替代。
6. Presentation reference 不支持 subject-matter claim。
7. 攻擊案例只提供理解防禦所需的 mechanism，不建立未授權攻擊操作環境。

## 4. Current source decisions

- NIST CSF 2.0：用來檢查課程有沒有只教 Prevent，而漏掉 Detect / Respond / Recover / Govern；**不照六 Functions 排課**。
- OWASP：核心 application-security mechanism 來源。
- PortSwigger：Teaching Case / observable mechanism，尤其 access control、injection、browser / server trust。
- MITRE ATT&CK：在 detection / response 與 integrated transfer 中理解「入侵後會往哪裡走」，不當攻擊清單背誦。
- 飛飛：保留其初學者入口、台灣學習語境與 coverage value；新版的中心從「學哪些資安主題」改為「如何做安全判斷」。

## 5. Next gate

本輪在以下內容完成後停止：
- Subject Model
- Pyramid Curriculum Proposal
- legacy content disposition
- teaching / transfer case strategy

使用者確認 Curriculum 後，才建立 Canonical Content。
