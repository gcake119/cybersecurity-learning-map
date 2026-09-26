# Unit 2 — 誰會造成問題？現在這個風險有多重要？

> Content Review: PASS — 2026-09-26

## Central Question
從「這裡有漏洞」到「我們現在應該先處理它」，中間缺哪些 evidence？

## Learning Objectives
- 分清 weakness、vulnerability、threat、exposure、impact 與 risk。
- 說明 CVE / CWE / CVSS / EPSS / CISA KEV 各回答不同問題。
- 把版本、reachability、known exploitation、compensating control、asset consequence 放回部署情境。
- 對 AI / scanner 的 prioritization 要求 evidence 與 assumption。

## Core Claims
1. Risk 是 context-dependent；NIST 將 risk 描述為 adverse impact 與 likelihood 的函數。
2. Vulnerability existence 不等於 exploitation path 在特定 deployment 可達，也不等於 impact 相同。
3. EPSS 是公開 CVE 未來 30 天 observed exploitation activity 的 probability estimate，不是完整 risk score，不知道你的資產、環境或 compensating controls。
4. CISA KEV 表示有 confirmed in-the-wild exploitation，適合作為 vulnerability prioritization 的重要輸入；不代表 catalog 外漏洞安全。
5. CVSS、EPSS、KEV、vendor advisory、local deployment evidence 不能互相替代。
6. AI 可協助收集與整理 vulnerability intelligence，但必須標明來源日期、版本匹配與 local context。

## Reasoning Chain
Finding/advisory → 這個產品／版本真的受影響？→ exploitation prerequisites / reachability → active exploitation evidence → asset / business consequence → mitigations → remediation urgency / next evidence。

## Required Terminology
- Weakness：可能導致安全問題的設計／實作缺陷類型。
- Vulnerability：可被利用而違反安全要求的具體弱點。
- Threat：可能造成 harm 的 circumstance / event / actor。
- Exposure / reachability：攻擊路徑是否能接觸到 vulnerable condition。
- Impact：事件發生後的 adverse consequence。
- Risk：結合 likelihood 與 impact 的 contextual judgment。
- CVE：公開漏洞識別。
- CWE：弱點類型分類。
- CVSS：技術嚴重度描述／評分體系，不是 local risk。
- EPSS：未來 30 天 exploitation activity probability estimate。
- KEV：CISA 已知遭實際利用漏洞 catalog。

## Teaching Case
兩個 synthetic Web services A/B 使用相同 severity 的 vulnerable component。逐輪改：
- affected version；
- Internet / internal reachability；
- KEV / exploitation signal；
- core vs non-critical asset；
- temporary mitigation；
- patched / not affected。
模型只顯示 evidence 與 priority rationale，不假裝算出 universal risk score。

## Misconceptions / Boundary Cases
- CVSS 高 ≠ 一定先修；但也不能因 local exposure 看似低就忽略高 impact / future change。
- EPSS 5% ≠ 你的 server 有 5% 被入侵機率。
- KEV 是 historical confirmed exploitation signal；EPSS 是 forward-looking estimate。
- 沒對外 ≠ 不可達；內部 compromised host、VPN、service-to-service path 都可能改變 reachability。
- Scanner finding ≠ deployment confirmed vulnerable。

## Transfer Principle
任何 vulnerability finding 都先問 presence → reachability → consequence → mitigation → evidence freshness，再決定行動。

## AI Collaboration
Agent 可讀 advisory、lockfile / version、整理 CVSS/EPSS/KEV、列出待查證條件；不得把模型分數直接宣告成 local risk。

## Claim-level Source Mapping
- NIST risk glossary / SP 800-30 lineage：risk 通常由 adverse impact 與 likelihood 構成。
- FIRST EPSS FAQ：EPSS 是 30-day exploitation probability，明確不是 complete risk score。
- CISA KEV：authoritative catalog of vulnerabilities exploited in the wild，作 prioritization input。
- NIST CSF 2.0：risk outcomes 用於 understand / assess / prioritize / communicate。

## Content Review
PASS。保留 vulnerability operations 所需工具語彙，但 learning outcome 仍是 contextual risk reasoning。