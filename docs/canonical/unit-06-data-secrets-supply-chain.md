# Unit 6 — 資料、Secret 與第三方程式碼可以相信到什麼程度？

> Content Review: PASS — 2026-09-26

## Central Question
資料有加密、secret 不在 source code、dependency 來自 package manager，就足以建立信任嗎？

## Learning Objectives
- 依 threat model 判斷 data minimization 與 encryption boundary。
- 說明 secret 的 creation / rotation / revocation / expiration。
- 沿 source → dependency → build → artifact → deploy 描述 software supply chain trust。
- 分清 dependency finding、secret exposure、artifact integrity 與 runtime compromise。

## Core Claims
1. 最小化敏感資料保存可直接減少 exposure。
2. Encryption 保護什麼取決於 layer 與 threat model；disk-level encryption 對 physical theft 有效，但對已控制 running server 的 attacker 可能無效。
3. Keys / secrets 需要 lifecycle、least privilege、rotation / revocation；「放 environment variable」不是 universal guarantee。
4. Software supply chain 涵蓋 source、third-party libraries、VCS、build tools、CI/CD、package ecosystem、artifacts 等整條 SDLC chain。
5. Dependency vulnerability presence 不自動等於 application exploitable；仍需 version / reachability / usage / mitigation evidence。
6. Secure software development practices 應整合進既有 SDLC，而不是 release 前一次性掃描。

## Reasoning Chain
asset / artifact → who can read/replace/use it → threat location → control boundary → residual capability → lifecycle / provenance evidence → verify after change。

## Required Terminology
Data minimization、Encryption at rest / in transit、Secret、Rotation / revocation、Dependency、Software supply chain、Provenance。

## Teaching Case
小型電商 CI/CD：Git repo → dependencies → CI runner → artifact registry → deployment；另有 customer DB、payment API key、deploy token。切換 lost disk、app compromise、leaked CI token、vulnerable dependency、upstream compromise、artifact replacement。

## Misconceptions / Boundary Cases
- Encryption at rest 不等於 app compromise 後資料仍不可讀。
- Secret manager 不保證 consumer 不會洩漏 secret。
- Rotation 沒有 revoke / downstream update plan 可能造成 outage。
- SBOM / dependency list 是 inventory evidence，不等於 exploitability proof。
- Signed / traceable artifact 不自動保證 code 沒 vulnerability。

## Transfer Principle
沿「資料／secret／software 從哪裡來 → 誰可改 → 誰可讀／執行 → 如何撤銷／替換」追完整 chain。

## AI Collaboration
Agent 協助 inventory dependencies / secrets locations / CI permissions / artifacts、比對 advisory、提出 rotation / remediation；學習者核對實際 permissions 與 deployment path。

## Claim-level Source Mapping
- OWASP Cryptographic Storage：encryption layer 依 threat model；minimize sensitive storage。
- OWASP Secrets Management：creation、rotation、revocation、expiration lifecycle；least privilege。
- OWASP Software Supply Chain Security：SSC 橫跨 source、libraries、VCS、build / CI/CD、package tools。
- NIST SP 800-218 SSDF 1.1：secure practices 應整合到 SDLC。

## Content Review
PASS。Encryption、secret management、dependency / artifact trust 責任清楚。