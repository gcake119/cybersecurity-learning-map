# Unit 7 — 怎麼證明保護有效？失效時怎麼知道發生了什麼？

> Content Review: PASS — 2026-09-26；2026-10-02 完成先備／術語重構 review

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

- Verification evidence（驗證證據）：支持指定安全主張的可檢查結果。
- SAST（靜態應用程式安全測試）：分析程式碼尋找規則／資料流線索。
- Finding（工具發現）：符合分析條件的結果，需調查適用性。
- False positive／false negative（誤報／漏報）：標到非目標問題／存在目標問題卻未標到。
- SCA（軟體組成分析）：檢查依賴元件／版本，不能單獨證明本部署可被利用。
- Secret scanning（秘密掃描）：找出疑似秘密字串；移除 match 不代表撤銷。
- Negative test（負向測試）：檢查禁止行為被拒絕且未造成副作用。
- Security event log（安全事件紀錄）：為調查保留何時、何地、誰、做什麼。
- Correlation（關聯）：用識別碼等線索把相關事件連起來；不是完整故事的保證。
- Coverage（涵蓋範圍）：證據實際檢查的條件與路徑。

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

## Prerequisites and baseline bridge — 2026-10-01

Test 是對指定條件與結果的檢查；log 是發生事情留下的紀錄；scanner 是依規則尋找線索的工具。先說清 claim，再判斷它們各自支持哪個範圍。

本章安全推理視為 New／unfamiliar；必要 READ 先補上述先備與 mechanism，觀察後的術語摘要不是唯一解釋來源。

## Refactor source links

- [OWASP Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
- [Semgrep CLI reference](https://docs.semgrep.dev/cli-reference)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
