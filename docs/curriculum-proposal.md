# Cybersecurity Learning Map v2 — Curriculum Proposal v0.1

> 日期：2026-09-26
> 狀態：**Curriculum Confirmation Gate — 待確認**
> 本文件不修改 legacy UI，也不進 Canonical Content / Storyboard / Implementation。

## 1. 重新定義課程目的

舊版核心問題是：

> 如何判斷自己的 Web 系統有沒有保護重要資料與操作？

新版建議提高一層，保留開發者可用性：

> **面對一個系統或功能，能先說清楚要保護什麼、誰／什麼可能造成傷害、哪些邊界不能直接相信；再選擇與放置防護，觀察失效後攻擊或損害能走多遠，並用測試、日誌與回復證據判斷保護是否真的成立。**

完成後應能把相同 reasoning 轉用到 Web、內部系統、背景工作、檔案處理、第三方依賴與部署流程；不以背漏洞清單、工具指令或證照題目為完成標準。

## 2. Target learner / depth

### 目標受眾
- 已接觸軟體系統或開發流程；
- 可理解 browser / backend / database / API 的基本角色；
- 對資安尚未形成完整 mental model；
- 不要求會讀完整 codebase、不要求先會滲透測試工具。

### 內嵌 prerequisite
第一次需要時再補：
- HTTP request / response；
- process / service / network 基本概念；
- account / session；
- dependency / package；
- logs / test 基礎。

Linux / SSH 仍有價值，但不再占一個核心 reasoning unit；可成為 evidence / environment 的補充 skill。

### 深度
學習者要能：
- identify asset / consequence；
- 建立簡化 threat model；
- 判斷 trust boundary；
- 分清 authentication / authorization；
- 判斷 input 在哪個 execution context 被重新解讀；
- 看出 privilege / segmentation 對 blast radius 的影響；
- 判斷資料、秘密與 dependency 的保護範圍；
- 從 logs / alerts / tests 判斷 security evidence；
- 在 failure / incident 後描述 containment / recovery；
- 把原理 transfer 到新系統。

## 3. Subject Model

### 核心能力 A — Security objective reasoning
**問題：到底要保護什麼，什麼結果不可接受？**

必要概念：
- asset / data / service / identity；
- confidentiality / integrity / availability 作為 impact vocabulary；
- security objective / invariant；
- consequence / business impact；
- scope / assumption。

常見誤解：
- 「有登入」= 安全；
- 「有加密」= 安全；
- CIA 是三個要背的標籤，而不是描述損害的語言。

可轉移能力：
- 面對任何功能先寫出不可接受的結果，而非先選 security tool。

### 核心能力 B — Threat / risk reasoning
**問題：誰或什麼可能讓保護失效？這件事現在值得多優先？**

必要概念：
- threat actor / event；
- vulnerability / weakness；
- likelihood / exploitability evidence；
- impact；
- exposure / reachability；
- risk is contextual。

常見誤解：
- CVSS = 自己系統的風險；
- CVE 出現就一定要用相同優先順序處理；
- 沒上 KEV = 不會被利用。

可轉移能力：
- 依部署與業務情境整理 evidence，再決定處理優先序。

### 核心能力 C — Trust / identity / authority reasoning
**問題：跨過這條線後，哪些資訊不能直接相信？誰能對哪個資源做什麼？**

必要概念：
- trust boundary；
- authentication；
- session / identity continuity；
- authorization；
- resource / action / subject；
- least privilege / default deny；
- service identity。

常見誤解：
- authentication 自動帶來 authorization；
- 內網自動可信；
- UI 隱藏即可限制操作；
- role 足以描述所有物件層級權限。

可轉移能力：
- 對 user、service、batch、worker、admin path 都提出相同的 authority questions。

### 核心能力 D — Data / interpretation boundary reasoning
**問題：資料在哪一步可能變成另一種意思或另一種權力？**

必要概念：
- input validation；
- parser / interpreter / execution context；
- parameterization；
- contextual output encoding；
- file / path / URL boundary；
- deserialization / command / markup 作為不同 interpretation contexts。

常見誤解：
- validation 能取代 parameterization；
- SQL 防護會同時解決 XSS；
- 「資料存進自己系統」之後就可信。

可轉移能力：
- 追蹤 data → interpreter，找出資料變成 instruction / markup / path / destination 的位置。

### 核心能力 E — Containment / blast-radius reasoning
**問題：某個帳號、service 或 component 被突破後，還能碰到多少東西？**

必要概念：
- privilege；
- least privilege；
- segmentation / network boundary；
- credentials / secrets；
- service-to-service access；
- lateral movement（作 consequence，不要求背 ATT&CK）；
- defense in depth。

常見誤解：
- perimeter 擋住就安全；
- 一個 WAF / firewall 可以理解業務 authorization；
- service 共用高權限帳號只是維運方便，沒有安全代價。

可轉移能力：
- 用「compromised X 後還能做什麼？」檢查權限與邊界。

### 核心能力 F — Data / dependency / supply-chain protection
**問題：要保護的東西不只在 request path；資料、secret、套件與 build chain 怎麼被信任？**

必要概念：
- data minimization；
- encryption in transit / at rest 與 threat model；
- key / secret lifecycle；
- dependency provenance / vulnerability；
- build / CI/CD / artifact trust；
- software supply chain。

常見誤解：
- encryption at rest 可防已取得應用權限的攻擊者；
- secret 放 environment variable 就永遠安全；
- 自己沒有寫那段 code，所以 dependency risk 不算自己的。

可轉移能力：
- 從資料與軟體來源一路追到消費者，找出誰能替換、讀取、發布。

### 核心能力 G — Detection / evidence / response reasoning
**問題：保護失效時，我怎麼知道？知道後能限制與恢復嗎？**

必要概念：
- security-relevant logs；
- correlation / identity / timestamp；
- anomaly / alert；
- detection coverage；
- incident containment；
- recovery / restore；
- test vs production evidence；
- negative / regression security tests。

常見誤解：
- logging 越多越好；
- HTTP 403 就證明沒有副作用；
- CI 綠燈 = secure；
- 備份存在 = 可以恢復。

可轉移能力：
- 把 security objective 連到 test / runtime evidence / owner / response action。

### Subject Model prerequisite chain

```text
A 保護目標
  ↓
B 威脅與風險
  ↓
C 信任、身分、權限 ─┐
D 資料與解讀邊界   ├─→ E 限制影響範圍
                     ↓
F 資料／秘密／供應鏈
                     ↓
G 偵測、驗證、應變與恢復
```

Threat modeling 是 A–F 的整合 reasoning method，不建議孤立成「畫 DFD + 跑 STRIDE」的一章後就結束。

## 4. Pyramid Curriculum Proposal

### Highest-level Learning Outcome

> **能沿著一個系統的資產、資料流、身分與執行路徑，找出需要保護的 security objectives 與 trust boundaries；在明示 threat / risk 情境下選擇合適控制，推演控制失效後的 attack path / blast radius，並用 evidence 驗證、偵測、限制與恢復。**

### Major Understandings

1. **Security starts from consequences and trust assumptions**：先定義什麼不能發生，以及目前相信了什麼。
2. **Controls work at specific boundaries**：authentication、authorization、validation、encoding、segmentation、encryption 各自解不同問題。
3. **Compromise is about reach, not only entry**：要看突破後能走多遠、拿到什麼權力。
4. **Security is maintained by evidence and response**：測試、防護、logging、detection、response、recovery 是同一條 security claim 的不同證據與生命週期。

## 5. Proposed units

### Unit 1｜先說清楚：什麼不能發生？

**Central question**
一個功能「正常可用」，還有哪些結果是不能接受的？

**學完多出的判斷能力**
能從資產與 consequence 寫出具體 security objectives，區分資料外洩、未授權改動、服務不可用與其他業務損害。

**必要概念**
Asset、security objective、CIA 作 impact vocabulary、scope、assumption。

**Teaching case**
線上文件分享：公開文件、私人文件、編輯權限、服務中斷。改分享規則後，哪種 consequence 改變？

**Transfer**
Sim-sik / 衛生局案件：列出資料、狀態、服務與角色的不可接受結果，不先提出 WAF / encryption / MFA。

---

### Unit 2｜誰會造成問題？現在這個風險有多重要？

**Central question**
「有漏洞」到「我現在要先處理它」中間缺哪些證據？

**學完多出的判斷能力**
能把 weakness / vulnerability / threat / exposure / impact 分開，使用 vulnerability intelligence 作 evidence，不把單一分數當部署風險。

**必要概念**
Weakness、vulnerability、threat、exposure、likelihood evidence、impact、risk；CWE/CVE/CVSS/EPSS/KEV 作工具語彙。

**Teaching case**
兩個相同 CVSS 的虛構元件，改變版本、是否對外、已知利用、資產重要性與 mitigation，觀察 priority 改變。

**Transfer**
Podcast hosting 或 self-hosted service 的 dependency advisory：判斷需要補查什麼才能決定行動。

---

### Unit 3｜跨過這條線後，還能相信什麼？

**Central question**
登入成功後，為什麼傳進來的資源 ID、角色、檔案與 service request 還不能直接相信？

**學完多出的判斷能力**
能畫出 trust boundaries，對每個 request 說清楚 subject、identity、resource、action 與 server-side authorization；理解 least privilege / default deny。

**必要概念**
Trust boundary、authentication、session、authorization、resource-level access、least privilege、service identity。

**Teaching case**
共享文件系統：Alice 已登入，改 URL / resource ID 嘗試存取 Bob 文件；再加入 background worker / admin service，看相同資源規則是否仍有效。

**Transfer**
衛生局案件 / Sim-sik：前台、心理師、行政、背景工作各自可以對哪些資源做什麼？

---

### Unit 4｜資料在哪一步變成了「指令」或另一種意思？

**Central question**
同一串外部文字，為什麼進 SQL、HTML、shell、URL 或 parser 後會產生完全不同的 consequence？

**學完多出的判斷能力**
能追蹤 data 到 interpretation context，選擇 validation、parameterization、contextual encoding / safe API 等對應控制，不把它們混成「sanitize」。

**必要概念**
Input validation、interpreter / parser boundary、SQL parameterization、output encoding、path / URL / command contexts。

**Teaching case**
安全的 synthetic pipeline：同一字串依序送到 SQL query builder、HTML renderer、shell-like mock interpreter；控制 safe API 後只顯示結構變化，不提供真實 exploit payload recipe。

**Transfer**
VocaScript / 文件引擎：上傳檔名、解析結果、外部 command invocation、HTML 顯示各自在哪裡需要不同 boundary control？

---

### Unit 5｜一個元件被突破後，影響能走多遠？

**Central question**
如果某個帳號、API 或 worker 已經 compromised，接下來哪些資源仍會被保護？

**學完多出的判斷能力**
能用 privilege、credential、network / service boundary 與 segmentation 推演 attack path / blast radius；比較 least privilege、segmentation、separate identity、defense in depth 的效果。

**必要概念**
Privilege、credential、service identity、network exposure、segmentation、lateral movement、blast radius、defense in depth。

**Teaching case**
三層服務圖：public API → worker → database / object storage。切換共用 admin credential、最小權限、network segmentation，看 compromised component 可達節點改變。

**Transfer**
multi-repo / VM deployment：document-engine、backend、Postgres、Gotenberg 等如果其中一個被突破，現有身份與網路邊界允許走到哪裡？

---

### Unit 6｜資料、秘密與第三方程式碼要相信到什麼程度？

**Central question**
資料有加密、secret 放進環境變數、套件來自 package manager，就能放心嗎？

**學完多出的判斷能力**
能依 threat model 決定 data minimization、encryption boundary、secret / key storage 與 dependency / artifact trust；理解 supply-chain risk 是整個 SDLC 的問題。

**必要概念**
Sensitive data minimization、encryption in transit / at rest、key / secret lifecycle、dependency trust、artifact / build provenance、software supply chain。

**Teaching case**
一個 service 的 data / secret / dependency chain。改攻擊位置（lost disk、compromised app、leaked CI token、upstream package compromise），觀察不同 control 能／不能保護什麼。

**Transfer**
自動發文工具或 GitHub Actions：repo token、Actions、dependency、build artifact 各自的信任與權限。

---

### Unit 7｜保護失效時，怎麼知道發生了什麼？

**Central question**
如果攻擊被擋住、沒被擋住、或只完成一半，哪些 evidence 能讓你判斷？

**學完多出的判斷能力**
能設計 security-relevant logging / detection，不用「log 全部」取代判斷；能把 event、identity、resource、decision、time 串起來，分辨 test evidence 與 production evidence。

**必要概念**
Security event logging、correlation、alert、detection signal、false positive / coverage、test evidence、side effect verification。

**Teaching case**
登入異常、越權 request、敏感資料大量讀取。切換 log fields / correlation / alert rule，看 investigation timeline 能否重建。

**Transfer**
衛生局案件：需要留下什麼，才能判斷誰在何時讀取／修改哪一案件，又不把敏感內容寫進 log？

---

### Unit 8｜知道出事之後，怎麼限制、恢復，再避免重演？

**Central question**
偵測到異常後，「關掉服務」之外還有哪些不同層次的 response / recovery？

**學完多出的判斷能力**
能從 detection 走到 containment、credential revoke / permission reduction、isolation、restore / recovery、post-incident change；知道 backup、rollback、credential rotation、patch 各自解不同問題。

**必要概念**
Containment、response ownership、credential revocation / rotation、isolation、recovery、restore、security regression test、lessons learned。

**Teaching case**
Synthetic incident chain：account compromise → data access anomaly → alert → containment choices → recovery。不同選擇改變仍暴露的資源與恢復狀態。

**Transfer**
Podcast hosting / self-hosted service：如果 deployment credential 洩漏，如何限制影響、重新建立可信狀態、驗證恢復？

---

### Final Integrated Transfer｜從一張系統圖做完整 security reasoning

不提示章節名稱。

給一個包含：
- browser / user；
- API；
- background job；
- database；
- object storage；
- third-party dependency；
- CI/CD；
- logs / alerts

的 synthetic system。

學習者依序處理：
1. 重要資產與不可接受 consequence；
2. threat / exposure；
3. trust / authority；
4. interpretation boundary；
5. compromised component blast radius；
6. data / secret / dependency protection；
7. evidence；
8. response / recovery。

最後再換成使用者熟悉的一個系統做 Transfer，不給對應答案。

## 6. Teaching case strategy

### Teaching Cases
採一般、可理解且來源充分的案例：
- shared document / case records；
- booking / account resource；
- simple Web input pipeline；
- 3-tier service / worker；
- CI/CD / dependency chain；
- synthetic incident timeline。

Teaching case 的目的：**讓 mechanism 可見**，不追求 exploit realism。

### Transfer Cases
從下列挑選，不固定一章一個：
- Sim-sik；
- 台南市衛生局案件系統；
- Podcast hosting；
- VocaScript；
- 自動發文；
- multi-repo deployment；
- AI-assisted development workflow。

Transfer 不顯示「這題是 authorization / injection / supply chain」等提示。

## 7. Legacy content disposition

| 舊內容 | 建議處理 |
| --- | --- |
| Unit 1 CIA / 安全需求 | **保留核心，重寫並擴成新版 U1**；CIA 降為 consequence vocabulary |
| Unit 2 trust boundary / PDF flow | **拆分重用**；trust / authority 進 U3，parser / file interpretation 進 U4 |
| Unit 3 vulnerability prioritization | **保留，成新版 U2**；強化 risk context，不當工具資料庫課 |
| Unit 4 authentication / authorization | **保留核心，併入新版 U3** |
| Unit 5 SQL / HTML boundary | **保留 mechanism，擴成新版 U4**；不只 SQL/XSS |
| Unit 6 requirements → implementation positions | **拆散成全課 pattern**；每個 control 都要求明示 boundary / responsibility |
| Unit 7 Linux / SSH evidence environment | **移出核心 unit**，放 prerequisite / evidence supplemental |
| Unit 8 request replay / single-variable evidence | **保留方法，融入 U3/U4/U7 的 verification rhythm** |
| Unit 9 regression / monitoring | **拆成 U7 + U8**，增加 incident containment / recovery |
| WAF / IDS / IPS vocabulary | 改為局部案例，不作核心元件分類 |
| Burp / curl / DevTools | 保留作 authorized lab / supplemental tool，不作 highest-level outcome |
| SystemWorkbench deterministic model | 概念保留；新版依 unit mechanism 建不同 model，不預設同一 workbench |

## 8. Deliberately out of core scope

本版核心不要求：
- Kali Linux 工具鏈；
- exploit payload memorization；
- malware reverse engineering；
- cryptographic algorithm implementation；
- enterprise SOC / SIEM product administration；
- cloud-provider security certification；
- ATT&CK technique memorization；
- full penetration-testing methodology；
- compliance framework memorization。

這些可在核心 reasoning 建立後另做 extension decks。

## 9. Curriculum Gate discussion points

需要確認五件事：

1. **主線**：是否接受「security reasoning / boundaries / blast radius / evidence / recovery」取代原本偏 Web security learning path 的主線？
2. **深度**：Supply chain 與 incident recovery 是否應列為核心，而不是延伸？
3. **順序**：U2 risk prioritization 要放在 trust / mechanism 前，或移到後段 vulnerability operations？
4. **Teaching case**：是否接受新版用多個標準案例，而不再九章共用案件系統？
5. **Transfer**：Final 是否以一個 synthetic integrated system 先做，再換使用者實際系統？

課綱確認前停止；不建立 Canonical Content、不設計 UI、不實作 simulator。
