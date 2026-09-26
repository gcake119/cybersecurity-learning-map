# Cybersecurity Learning Map v2 — Interaction Storyboard v0.1

> 日期：2026-09-26
> 狀態：Storyboard PASS
> Source of truth: confirmed curriculum + Canonical Content + Cross-unit Content Review
> Implementation 尚未開始。

## Shared interaction grammar

參考 `gcake119/system-design-simulator` 的 component interaction / animation / state propagation：
- 左／上：scenario / constraint controls；
- 中央：mechanism graph；
- graph node / edge 顯示 state / blocked / exposed / evidence；
- 右／下：只顯示當下需要的 consequence / evidence / limitation；
- learner 改 parameter 後 deterministic model 重算；
- 支援 before / after；
- animation 顯示 request / data / compromise / evidence 如何沿 graph 傳播；
- reduced-motion 時以 step/state transition 取代移動動畫。

每個 Unit 使用不同 model，不共用虛構 security score。

## Unit 1 — Security Objectives

### Stage 1: 先看 consequence
**看到**：Shared Document System；private doc、owner、viewer、service。
**可改**：event = unauthorized read / unauthorized edit / outage；document policy = private/public。
**state**：document exposure / content changed / service unavailable。
**consequence**：受影響 asset 高亮。
**術語**：先問「哪個結果不能接受？」後才揭露 Asset / Confidentiality / Integrity / Availability。

### Stage 2: 把願望變成 objective
**可改**：actor、resource、allowed action、availability assumption。
**state**：objective sentence builder 由 model 產生 bounded statement。
**constraint change**：private → public；原本「任何非 owner read 都是 breach」失效。
**揭露**：scope / assumption。

### Stage 3: AI collaboration
顯示 Agent 提出的 5 個 possible objectives，其中混有：
- 真正 consequence；
- solution disguised as objective（例如「必須用 MFA」）；
- unsupported business assumption。
Learner 不是選正確答案，而是把項目拖到 confirmed / assumption / solution，系統顯示 reasoning relation。

### Transfer
換成 case-management domain，只提供 roles / data / actions。Learner 操作 asset/consequence graph，不提示 CIA。

## Unit 2 — Threat / Risk

### Stage 1: 同 severity，不同 context
兩個 synthetic services A/B。
**可改**：affected version、internet reachable、known exploitation signal、asset impact、mitigation。
**state**：presence / reachability / exploitation evidence / consequence cards。
**consequence**：priority rationale 隨 evidence 改變，不算 universal risk score。
**術語**：Weakness / Vulnerability / Threat / Risk。

### Stage 2: Evidence sources
Learner 開啟 CVE/CVSS/EPSS/KEV/vendor/local inventory cards。
每張只改它真正回答的 state。
EPSS 顯示「population-level 30-day exploitation probability」；KEV 顯示 confirmed exploitation history。

### Stage 3: constraint reversal
B 從 internal → public；A 加有效 mitigation。原排序必須重新評估。

### Transfer
Self-hosted dependency advisory；只給 deployment facts，要求 learner 決定還缺哪些 evidence。

## Unit 3 — Trust / Authorization

### Stage 1: authenticated ≠ authorized
Shared Document System。
**可改**：identity Alice/Bob/guest、resource、action。
**state**：request path client → API → resource。
**control**：authn / resource authz 放 before read/write 或 after。
**consequence**：data / write side effect 是否已發生。
**術語**：Authentication / Authorization。

### Stage 2: trust boundary
加入 preview worker / admin export job。
**可改**：service identity、permission scope、default policy。
Graph 標 trust crossings；deny-by-default / least privilege 後才揭露術語。

### Stage 3: constraint change
新增 batch path 繞過原 API enforcement；learner 必須把 policy 放到能涵蓋所有 authoritative writes 的位置。

### Transfer
Sim-sik / case system subject-resource-action graph；不提示 authorization。

## Unit 4 — Interpretation Boundaries

### Stage 1: 同一資料，不同 interpretation
E-commerce graph：Input → SQL / HTML / Path / Command-like mock。
**可改**：input type（normal / structural marker）、sink。
**state**：parse tree / rendered interpretation / resolved path / structured call。
不顯示真實 exploit payload recipe。

### Stage 2: controls
**可改**：business validation、parameterized query、safe renderer、constrained path、structured process API。
每個 control 只影響適用 sink。
**consequence**：data stays data / structure changed / destination escaped。

### Stage 3: constraint change
需求改為允許 rich text；「全部 encode 成純文字」不再符合功能，需要 context-specific sanitization policy。

### Transfer
Document/VocaScript pipeline：filename → parser → extracted text → HTML → external process。Learner 找 interpretation boundaries。

## Unit 5 — Blast Radius

### Stage 1: assume API compromised
Three-tier SaaS。
**可改**：compromised component。
Graph animation 從該 node 沿 credential + network + permission edges 擴散。
**metric**：reachable resources / allowed actions，不顯示成功率。

### Stage 2: shrink reach
**可改**：shared vs separate service identity、DB scope、storage scope、network segmentation。
**consequence**：blocked edges / remaining reachable nodes。
揭露 Least Privilege / Segmentation / Blast Radius。

### Stage 3: constraint change
Worker 新增 legitimately-needed storage write；原「完全阻擋 storage」已不成立，需最小必要 scope。

### Transfer
multi-service VM architecture；指定某 component compromised，learner 自行推演。

## Unit 6 — Data / Secrets / Supply Chain

### Stage 1: encryption depends on threat
Data / key / app / disk graph。
**可改**：threat location = stolen disk / compromised app。
**control**：disk encryption / app-level encryption / data minimization。
**consequence**：attacker can/cannot read data；不宣稱 encryption universal。

### Stage 2: secret lifecycle
CI token / provider key。
**可改**：scope、shared identity、rotation、revocation。
Timeline 顯示 leaked credential 在「source removed but not revoked」後仍有效。

### Stage 3: supply chain
Repo → dependency → CI → artifact → deploy。
**可改**：dependency status、CI permission、artifact provenance / verification。
**consequence**：which trust link can replace code/artifact。

### Transfer
Automated publishing / GitHub Actions chain。

## Unit 7 — Verification / Detection

### Stage 1: 同一 codebase，多種 evidence
Synthetic Web API 有 5 種 defect/evidence targets。
Panels：AI Review / Semgrep-like SAST / SCA / Secret Scan / Security Tests。
**可改**：enable evidence source。
**state**：findings matrix；每 finding 顯示 source、rule/claim、scope。
至少包含 TP、non-applicable/FP-like finding、scanner miss / business-logic issue。

### Stage 2: fix and rerun
**可改**：apply bounded fix。
findings / tests 重算。
揭露 Finding / FP / FN / Coverage。
Semgrep 流程：rule → match → finding → triage → fix → rescan；不教複雜 rule authoring。

### Stage 3: runtime evidence
注入 abnormal login / forbidden request / bulk access。
**可改**：log fields、interaction ID、alert rule。
Timeline 能否回答 when / where / who / what。

### constraint change
新增 background path；原 security test suite 沒涵蓋它，綠燈但 claim coverage 下降。

### Transfer
AI-assisted development workflow：Agent 提出「已修好」；learner 操作 evidence matrix 判斷還缺什麼。

## Unit 8 — Response / Recovery

### Stage 1: detect and scope
Synthetic deployment credential compromise。
Timeline：credential use → deployment/API → data access → log → alert。
**可改**：available evidence。
**state**：known / unknown affected identities/resources/time window。

### Stage 2: contain
**可改**：revoke credential、isolate service、reduce permissions。
Graph 顯示 active / blocked attack paths；同時顯示 availability consequence。

### Stage 3: recover trusted state
**可改**：rotate downstream secrets、redeploy trusted artifact、rollback code、restore data snapshot。
Checklist 分開 code trust / credential trust / data integrity / service availability。
揭露 Recovery / Restore。

### Stage 4: prevent recurrence
**可改**：add regression test / detection / permission change / threat-model update。
不做 incident score。

### Transfer
Self-hosted service credential compromise；不提示 response mechanism。

## Final Integrated Transfer

Synthetic collaboration SaaS：
Browser → API → DB / Worker → Object Storage / Third-party
Repo → CI → Artifact → Deploy
App → Logs → Alerts

五個 progressive incidents / changes，不標 Unit：
1. 新增 sharing feature；
2. dependency advisory；
3. compromised worker identity；
4. suspicious bulk access；
5. leaked deploy credential + questionable artifact。

Learner 必須在同一 canvas：
- 標 assets / objectives；
- inspect threat evidence；
- adjust trust / permission / interpretation controls；
- inspect blast radius；
- choose evidence tools；
- contain / recover。

最後換 learner 熟悉的 project domain；不提供 mechanism labels 或答案卡。

## Storyboard Review

PASS。
- 每 Unit 都有 parameter → deterministic state → visible consequence。
- 每 Unit 都有 constraint change。
- terminology 延後到 observable phenomenon 後。
- Teaching / Transfer 分離。
- System Design Simulator 的互動語言有沿用，但沒有複製 QPS model。
- U4 保持安全 synthetic interpretation。
- U7 tool coverage limitation 可見。
- U8 不產生虛構 incident probability / score。

下一步：Learning Copy。