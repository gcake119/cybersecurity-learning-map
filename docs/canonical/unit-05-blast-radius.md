# Unit 5 — 一個元件被突破後，影響能走多遠？

> Content Review: PASS — 2026-09-26

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
Compromise、Privilege、Credential、Segmentation、Lateral movement、Blast radius、Defense in depth。

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