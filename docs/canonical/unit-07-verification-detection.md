# Unit 7 — 怎麼證明保護有效？失效時怎麼知道發生了什麼？

> Content Review: PASS — 2026-09-26

## Central Question
AI 說修好了、scanner 沒報錯、tests 綠燈，各自能證明什麼？上線後又需要什麼 evidence？

## Learning Objectives
- 把 security objective / threat / control 對應到 verification evidence。
- 分清 AI review、SAST、SCA、secret scanning、positive/negative/regression tests 的 evidence type 與 coverage。
- 基本理解 Semgrep：rule match → finding → triage → fix → rescan；知道 false positive / false negative。
- 設計 security-relevant logs，能重建 when / where / who / what，避免不必要 secrets / sensitive data。

## Core Claims
1. Security verification 要回到 claim：哪個 unacceptable behavior / threat / control 正在被驗證？
2. Static-analysis finding 表示 code 與某 rule / analysis condition match；需要 triage，不等於 exploitability proof。
3. Scanner 沒 finding 只表示在 rules / analysis / scanned scope 下沒找到 match。
4. Positive test 證明 legitimate behavior；negative test 檢查 forbidden behavior / side effects；regression test 約束後續 change。
5. HTTP response / test pass 需要和實際 side effects / state 對照。
6. Security logging 應依目的記錄足夠的 when / where / who / what，並保護 logs 本身。
7. Detection 是從 signals 推論可能事件，需要 coverage / false positive / investigation context。

## Reasoning Chain
security claim → safe / unsafe examples → choose evidence → run review/scanner/test → inspect actual behavior → deploy → log / signal → alert → investigation → update claim / control。

## Required Terminology
Verification evidence、SAST、Finding、False positive、False negative、SCA、Secret scanning、Negative test、Security event log。

## Teaching Case
簡單 Web API 內建 synthetic defects：missing resource authorization、unsafe query construction、hard-coded fake secret、vulnerable synthetic dependency metadata、以及 generic pattern scanner 不一定發現的 business-logic flaw。比較 AI review / Semgrep-like SAST / dependency scan / secret scan / security tests。修正後 rescan / rerun；再送 abnormal login / forbidden request / bulk access，調整 log fields / correlation / alert。

Semgrep teaching depth：看懂 rule → match → finding；基本 local / CI scan；triage；fix / rescan；理解 FP/FN / analysis scope。不要複雜 custom rule authoring。

## Misconceptions / Boundary Cases
- AI review、Semgrep、tests 不互相替代。
- 100% tests passing 不等於 security complete。
- SAST finding severity 不直接等於 local risk。
- Logs 也是敏感 evidence，可能被 tamper。
- Alert 沒響不等於沒有 incident。
- Vendor-specific behavior 不泛化到所有 SAST。

## Transfer Principle
每次 AI / tool 說「安全」或「有問題」，都追問：它檢查了什麼、看到了什麼 evidence、scope 是什麼、什麼情況看不到？

## AI Collaboration
Agent 執行 scanner、整理 findings、追 code path、產生 negative tests、提出 fix、rescan；學習者要求 claim-evidence mapping 與 uncovered areas。

## Claim-level Source Mapping
- Semgrep docs：finding 是 rule match；定義 TP/FP/TN/FN；不同 engine / scope 有 capability boundary。
- OWASP Secure Code Review：architecture / entry points / authz / data flow / business logic / config review。
- OWASP Logging：security events、when/where/who/what、logs protection / monitoring。
- OWASP Threat Modeling：mitigations 應可測量／驗證。
- NIST SSDF：secure practices integrated into SDLC。

## Content Review
PASS。Semgrep 是 evidence tool，不是 security oracle；business-logic gap 刻意示範 scanner coverage boundary。