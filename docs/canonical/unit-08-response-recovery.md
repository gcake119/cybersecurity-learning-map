# Unit 8 — 知道出事後，怎麼限制、恢復，再避免重演？

> Content Review: PASS — 2026-09-26

## Central Question
偵測到異常後，如何停止持續傷害、重新建立可信狀態，並驗證同類問題不再發生？

## Learning Objectives
- 從 detection evidence 建立 bounded incident hypothesis。
- 區分 containment、remediation、recovery 與後續 improvement。
- 依 compromise 類型選 revoke/rotation、permission reduction、isolation、patch、restore。
- 說明 backup existence 與 verified recovery 不同。
- 把 incident evidence 回饋 threat model、tests、controls、logging / detection。

## Core Claims
1. Incident response 是 cybersecurity risk management 的持續部分；NIST SP 800-61r3 與 CSF 2.0 整合 detection、response、recovery。
2. Detection signal 需要 investigation；先界定 evidence、affected identities/resources/time window，再 containment。
3. Containment 目的是限制持續／擴大影響；不同 incident 需要不同 action。
4. Secret compromise 後需要 revoke / rotate，並考慮 downstream dependencies；刪 source secret 不會讓已洩漏 credential 自動失效。
5. Recovery 需要重新建立可接受的 trusted operating state，並用 tests / monitoring / restore evidence 驗證。
6. Backup 是 recovery input；沒有 restore / integrity / freshness evidence 不能直接宣告可恢復。
7. Post-incident improvement 應回到 causes、threat model、controls、tests、detection 與 playbook。

## Reasoning Chain
alert / report → validate signal → scope assets / identities → contain → remediate compromised path → recover trusted service/data → verify → monitor → update model/tests/controls/playbook。

## Required Terminology
Incident、Containment、Revocation、Rotation、Recovery、Restore、Lessons learned / improvement。

## Teaching Case
Synthetic account compromise：stolen deployment credential → unauthorized deployment / API access → unusual data reads → logs → alert。Learner 控制 log coverage、revoke credential、isolate service、reduce permissions、rotate downstream secrets、redeploy trusted artifact、restore data、regression tests。Graph 顯示 active attack paths、contained resources、trust-restoration checklist，不計算虛構成功率。

## Misconceptions / Boundary Cases
- 關服務可能 containment，但有 availability cost。
- Patch 不會自動撤銷已偷到的 credential。
- Rotate 前要知道 consumers / dependencies。
- Rollback code 不會自動還原被竄改資料。
- Restore backup 不會自動移除 compromise path。
- 沒有一套固定線性 playbook 適用所有事件。

## Transfer Principle
先問「現在知道什麼、哪些仍未知、什麼還在造成傷害、怎麼先限制它、怎麼證明恢復後重新可信」，再選 action。

## AI Collaboration
Agent 協助整理 timeline / evidence、產生 hypotheses、比較 containment / recovery options；學習者要求 evidence、authority、side effects 與 rollback plan。

## Claim-level Source Mapping
- NIST SP 800-61r3：incident response 整合進 cybersecurity risk management，改善 detection / response / recovery。
- NIST CSF 2.0：Govern / Identify / Protect / Detect / Respond / Recover 提供完整 risk-management outcomes。
- OWASP Secrets Management：compromised secrets 的 rotation / revocation / logging / dependency considerations。
- OWASP Logging：security logs 應與 incident response / monitoring 整合。
- NIST SSDF：處理 root causes，避免 vulnerability recurrence。

## Content Review
PASS。Containment / remediation / recovery 邊界清楚；不把 backup、patch、rollback、rotation 當同一種修復。