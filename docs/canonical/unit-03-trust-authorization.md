# Unit 3 — 跨過這條線後，還能相信什麼？

> Content Review: PASS — 2026-09-26

## Central Question
登入成功後，為什麼 resource ID、role、file metadata 與 service request 還不能直接相信？

## Learning Objectives
- 在系統圖上標出 external entities、data flows、trust boundaries 與 protected resources。
- 分清 authentication 與 authorization。
- 用 subject / resource / action / context 描述 authorization decision。
- 對 user、service、worker、batch path 套用 least privilege、deny by default 與 per-request enforcement。
- 假設 client 或 internal component 不可信時，找出真正 enforcement point。

## Core Claims
1. Authentication 證明／建立 identity；authorization 決定該 entity 對特定 resource/action 是否允許，兩者不同。
2. 已登入使用者不自動取得所有 resource/action 權限。
3. OWASP 建議 least privilege、deny by default，並在每個 request 驗證 permission。
4. Trust boundary 是需要做 trust decision 的交界；網路位置或「這是內部服務」不應自動等於全面可信。
5. Authorization 必須在能控制 resource / side effect 的 trusted enforcement point 執行；UI 隱藏不是 enforcement。
6. Service identities 與 machine-to-machine calls 同樣需要 scope 與 authorization。
7. AI 可以枚舉 access matrix / abuse paths，但 authority rule 必須回到業務 requirement 與 architecture。

## Reasoning Chain
request / message → identity evidence → subject → target resource → requested action → context → policy → enforcement point → allowed / denied → side effects / evidence。

## Required Terminology
- Authentication：確認／建立 entity identity。
- Authorization：判斷 entity 是否可執行指定 action / access resource。
- Trust boundary：兩側 trust level / authority 不同、需要驗證或決策的交界。
- Subject：提出 access request 的 user / service / process。
- Resource：被存取的資料、功能或能力。
- Least privilege：只授予完成工作所需最小權限。
- Deny by default：沒有明確允許條件時拒絕。
- Service identity：代表 machine/service 的 identity，不與人類帳號混用。

## Teaching Case
**線上文件分享系統**：
- Alice / Bob；
- public/private docs；
- viewer/editor/owner；
- direct API request；
- background preview worker；
- admin export job。
Learner 改 identity、resource owner、permission scope、enforcement location；graph 顯示 request 在哪裡被 blocked 或 data / write side effect 已發生。

## Misconceptions / Boundary Cases
- 401 / 403 是 protocol response evidence，不單獨證明 side effect 沒發生。
- RBAC 不是唯一 authorization model；resource ownership / attributes 可能也重要。
- Internal network 不自動可信；NIST ZTA 明確反對只因 network location 給 implicit trust。
- 每 request 驗證不代表所有系統都要每一層重做相同 authentication；重點是明確 trust / enforcement contract。
- Least privilege 不是「權限越少越好」；必須仍能完成 legitimate work。

## Transfer Principle
對任何入口都問：誰在要求？憑什麼知道是它？要操作什麼？允許條件是什麼？誰真正有能力阻止 side effect？

## AI Collaboration
Agent 協助產生 subject-resource-action matrix、找 missing paths / background jobs / admin routes；學習者核對 policy 是否符合真實工作規則。

## Claim-level Source Mapping
- OWASP Authorization Cheat Sheet：authentication vs authorization、least privilege、deny by default、validate permissions every request、design-time trust boundaries。
- NIST SP 800-207：不因 network location / ownership 自動給 implicit trust；resource-focused access decisions。
- OWASP Threat Modeling：DFD / trust boundaries / external entities / data flows 是 system model 的常用元素。

## Content Review
PASS。避免把 Zero Trust 當產品架構；避免把 RBAC 當完整 authorization；machine identities 已納入。