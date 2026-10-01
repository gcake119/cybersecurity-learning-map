# Unit 5 — 一個元件被突破後，影響能走多遠？

> Content Review: PASS — 2026-09-26；2026-10-02 完成先備／術語重構 review

## Central Question
如果某個帳號、API 或 worker 已經 compromised，接下來哪些資源仍然受到保護？

## Learning Objectives
- 在「entry 已失守」假設下推演 reachable resources / actions。
- 分開看 application authorization、service identity、credential scope、network reachability。
- 比較 least privilege、separate identities、segmentation、defense in depth 對 blast radius 的影響。
- 說明 containment control 的效果與限制，不把任何單一 perimeter control 當完整保護。

## Core Claims
1. Preventing initial compromise 與 limiting post-compromise impact 是不同 security questions。
2. Least privilege 應同時套用人與 service identities；權限範圍會直接影響 compromised identity 能做什麼。
3. Network segmentation 可限制 component 間 reachability，是 defense in depth 的一層；它不能取代 resource-level authorization。
4. 共用高權限 credentials 會擴大可達能力並降低 attribution / revocation granularity。
5. NIST Zero Trust 強調不因 network location 給 implicit trust，並以 granular resource access / least privilege 限縮權力。
6. Blast radius 是教學上的「此 compromise 在明示 assumptions 下能影響哪些 resources / actions」，不是 universal security score。

## Reasoning Chain
assume component compromised → inherit its identities / credentials / network routes → enumerate reachable resources → apply downstream authorization / segmentation → observe allowed actions → change control → compare blast radius。

## Required Terminology

- Compromise（失守）：元件或身分的信任假設已失效，例如程序被他人控制。
- Privilege（權限）：可對某資源執行的操作能力。
- Credential（憑證）：用於證明身分或取得存取能力的資料，例如 token。
- Segmentation（分段／隔離）：限制區域之間可建立的連線。
- Lateral movement（橫向移動）：失守後利用既有路徑取得其他元件的存取能力。
- Blast radius（影響範圍）：指定失守與假設下可受影響的資源／操作。
- Defense in depth（縱深防禦）：不同邊界提供互補控制；不是越多工具越安全。

## Teaching Case
三層 SaaS：Internet → API → Worker → DB / Object Storage / Email Provider。切換 shared admin credential、scoped identities、DB/storage permissions、network segmentation。Run 後標出 reachable / blocked edges 與 actions。

## Misconceptions / Boundary Cases
- Segmentation 不是「內網可信」。
- WAF / firewall 不能理解所有 business resource authorization。
- Least privilege 必須仍能完成 legitimate work。
- Defense in depth 不等於堆越多 controls 越好。
- Blast-radius model 不模擬 exploit success probability。

## Transfer Principle
對每個 component 問：「如果今天它已不可信，它現有的 credential、permission、network route 還能讓它做什麼？」

## AI Collaboration
Agent 依 architecture / IAM / network config 推演 reachable paths；學習者要求每條 edge 說明 credential、permission 與 route assumptions。

## Claim-level Source Mapping
- NIST SP 800-207：不因 network location 給 implicit trust；granular least-privilege resource access。
- OWASP Authorization：least privilege / deny-by-default。
- OWASP Network Segmentation：segmentation 作為 defense-in-depth，限制 public / application / backend reachability。
- OWASP Threat Modeling / Attack Surface：從 system model / paths / trust boundaries 找 attack paths。

## Content Review
PASS。Blast radius 保持 bounded teaching model；network 與 application authorization 沒有混為一談。

## Prerequisites and baseline bridge — 2026-10-01

接 U3 的正常允許規則。本章假設起點已被控制；worker 是代替人執行背景工作的程序，DB 是資料庫。路徑可達與具備操作權限都必須成立。

本章安全推理視為 New／unfamiliar；必要 READ 先補上述先備與 mechanism，觀察後的術語摘要不是唯一解釋來源。

## Refactor source links

- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)：支持既有本章 reasoning／mechanism；本次白話解釋未增加技術範圍。
- [OWASP Network Segmentation](https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html)：限制跨區連線與互補防禦；不以此來源的完整網路拓撲擴張課程。
- [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final)：網路位置不能自動等於可信。
