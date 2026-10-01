# Unit 6 — 資料、Secret 與第三方程式碼可以相信到什麼程度？

> Content Review: PASS — 2026-09-26；2026-10-02 完成先備／術語重構 review

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

- Data minimization（資料最小化）：只保存完成目的真正需要的敏感資料。
- Encryption at rest／in transit（靜態／傳輸中加密）：分別保護儲存或傳輸層；需按威脅位置與解密能力判斷。
- Secret（秘密）：不應公開、能取得身分或能力的值，例如 API key。
- Rotation／revocation（輪替／撤銷）：前者建立替代值並切換使用者，後者使舊值失效；兩者不能混同。
- Dependency（依賴套件）：應用引用的外部程式。
- Software supply chain（軟體供應鏈）：來源、套件、建置到交付的整條鏈。
- Provenance（來源證據）：產物由何處、何種流程產生的可查資訊；不保證無漏洞。

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

## Prerequisites and baseline bridge — 2026-10-01

套件是外部程式依賴；CI 是自動執行建置／檢查的流程；artifact 是可被發布／部署的產物。沿 U5 的身分與能力問誰能讀取或替換。

本章安全推理視為 New／unfamiliar；必要 READ 先補上述先備與 mechanism，觀察後的術語摘要不是唯一解釋來源。

## Refactor source links

- [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
- [OWASP Software Supply Chain](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
