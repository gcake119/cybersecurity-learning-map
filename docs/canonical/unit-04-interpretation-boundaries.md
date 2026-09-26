# Unit 4 — 資料在哪一步變成「指令」或另一種意思？

> Content Review: PASS — 2026-09-26

## Central Question
同一份外部資料進 SQL、HTML、path、URL、parser 或 command context 後，為什麼會產生不同 consequence？

## Learning Objectives
- 追蹤 untrusted data 從 source 到 interpreter / parser / sink。
- 分清 business input validation、safe / parameterized API、contextual output encoding 的責任。
- 看出「資料改變語法／目的地／路徑／執行內容」的 interpretation-boundary 問題。
- 不靠 payload memorization 也能解釋 SQLi / XSS / path / command-style injection 的共同機制與差異。

## Core Claims
1. Input validation 用來確認資料是否符合預期格式、範圍與業務規則；對自由文字而言，不能把禁止特殊字元當主要 XSS 防線。
2. Injection 的核心是 untrusted data 影響 interpreter 的 command / query structure；優先使用避免 interpreter 或提供 parameterized interface 的 safe API。
3. SQL parameterization 保護 SQL query structure，不會自動保護 HTML / shell / URL 等其他 contexts。
4. Output protection 必須 context-aware；不同 sink 有不同 encoding / safe construction。
5. Data 已進入自己的 database / storage 不代表之後可信；從 storage 取出後進另一 interpreter 時仍要按該 context 處理。
6. Parser / file / URL boundary 也要問：資料是否能改變 resource selection、execution、destination 或 resource consumption。
7. AI 可協助 data-flow tracing，但要確認 source / transformation / sink 是否真的存在於 code path。

## Reasoning Chain
source → expected data contract → transformations → sink / interpreter →「資料是否能改變 structure / destination / execution？」→ 選 control → negative / normal behavior evidence。

## Required Terminology
- Input validation：檢查資料是否符合應接受的格式、範圍、型別與業務規則。
- Interpreter / parser：把輸入依某種語法／格式解讀的元件。
- Parameterization：固定 query / command structure，將資料作為獨立參數傳入（依 API guarantee）。
- Contextual output encoding：依輸出 context 將資料表示成不被當成 active syntax 的形式。
- Source / sink：資料來源與被敏感操作／解讀的位置。

## Teaching Case
**簡單電商 Web App**，同一組 synthetic strings 進入：
- 商品搜尋 → SQL mock query builder；
- 商品評論 → HTML mock renderer；
- 圖片名稱 → path resolver；
- thumbnail job → command-like mock API。
Learner 切換 validation / parameterized API / safe renderer / constrained path / structured API。模型只呈現 parse tree / resolved destination / rendered interpretation 差異，不提供真實未授權 exploit recipe。

## Misconceptions / Boundary Cases
- 「sanitize everything」不是單一可泛化 control。
- Allowlist validation 對有限集合很有效，但不能取代 SQL parameterization / output encoding。
- Encoding 不是 encryption。
- Parameterized API 的 guarantee 取決於 API 與使用方式。
- Rich text 可能需要 sanitization policy；純 output encoding 會改變 intended rich-content behavior。
- File type / extension validation 不等於 parser sandboxing 或 malware detection。

## Transfer Principle
每遇到外部或先前儲存的資料，都沿 data flow 找下一個「會賦予它新語意」的 component，再問該 component 的 safe construction 是什麼。

## AI Collaboration
Agent 協助列 sources / transformations / sinks、找 string concatenation / unsafe APIs、提出 safer APIs；學習者以 code path、framework docs 與 tests 驗證。

## Claim-level Source Mapping
- OWASP Input Validation：validation 不是 free-form XSS 的 primary safeguard；server-side allowlist / semantic validation有其用途。
- OWASP Injection Prevention：safe API / parameterized interface 優先；input validation 不是完整 injection defense。
- OWASP Query Parameterization：parameterized queries 用於防止 input 改變 SQL structure。
- OWASP Secure Code Review：trace sources → processing → sinks → trust boundaries。

## Content Review
PASS。不同 interpretation contexts 已分離；不教 exploit payload memorization；模型可安全 synthetic 化。