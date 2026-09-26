# Unit 1 — 什麼不能發生？

> Content Review: PASS — 2026-09-26

## Central Question
一個功能正常可用，還有哪些結果是不能接受的？

## Learning Objectives
- 從人、資料、服務、身分與關鍵操作辨認需要保護的 assets。
- 把「要安全」改寫成有 scope、actor/resource 與可觀察 consequence 的 security objectives。
- 使用 confidentiality / integrity / availability 描述不同損害，但不把 CIA 當完整 threat model。
- 分清已知 requirement、assumption 與仍需確認的 security question。

## Core Claims
1. Security reasoning 需要先知道什麼有價值、哪些 adverse consequences 不可接受；控制工具不是起點。
2. CIA 是描述 impact 的常用 vocabulary：未授權 disclosure、未授權／不正確 modification、合法使用需求無法取得服務或資料；同一事件可同時影響多個面向。
3. Security objective 必須有 scope。不同角色、資料敏感度、業務流程與可接受 downtime 會改變需要的保護。
4. Threat modeling 需要持續維護；系統、資料流、信任與需求改變時，security assumptions 也要重評估。
5. AI Agent 可以協助枚舉 assets / consequences / assumptions，但不能自行決定真實業務 impact 或 risk tolerance。

## Reasoning Chain
工作情境 → 找 assets / critical actions → 問「哪些結果不可接受？」→ 描述 consequence → 寫 security objective → 標記 assumption / unknown → 後續 threat / control / evidence。

## Required Terminology
- Asset：對使用者、組織或系統有價值、需要保護的資料、服務、身分、能力或其他資源。
- Security objective：在指定 scope 下希望維持的安全結果。
- Confidentiality：避免資訊被未授權取得或揭露。
- Integrity：避免資訊／狀態被未授權或不正確地改變。
- Availability：合法使用需求在需要時能取得資料或服務。
- Assumption：目前暫時採用、仍可能被新 evidence 推翻的條件。

## Teaching Case
**線上文件分享系統**：公開文件、私人文件、owner/editor/viewer、分享連結、文件內容與服務可用性。
- 改「私人 → 公開」不一定是 confidentiality failure；要先看 owner 的 intended policy。
- viewer 修改內容是 integrity 問題。
- owner 在必要工作時無法讀取文件是 availability 問題。
- Teaching simplification：不處理完整法規、資料分類與 enterprise retention policy。

## Misconceptions / Boundary Cases
- 「資料被看到」不一定是 breach；公開資料本來就可讀。
- CIA 不等於 threat / vulnerability / risk。
- 「全部資料都最高保護」不是合理 requirement；控制有成本與 usability / operational trade-off。
- Availability 不等於 100% uptime。
- Security objective 不代表已選定 control。

## Transfer Principle
面對新系統，先能回答：保護什麼、誰需要它、哪些改變／揭露／中斷不可接受、scope 與 assumption 是什麼；不要先命名 WAF、MFA、encryption。

## AI Collaboration
Agent 可提出漏掉的 asset / adverse consequence / assumption；學習者必須回到需求與業務脈絡確認。Agent 的「這很敏感／高風險」不是業務事實。

## Claim-level Source Mapping
- NIST CSF 2.0：以高層 cybersecurity outcomes 管理、理解、評估與溝通 risk；CSF 不規定唯一實作方式。
- NIST CSF Identify / Asset Management / Risk Assessment：assets、business context、risk 與 assumptions 是 risk reasoning 的基礎。
- OWASP Threat Modeling：system model、data flows、trust boundaries、threats、responses、review / validation；threat model 應隨系統維護。
- OWASP Attack Surface Analysis：先辨認 valuable data、entry/exit paths 與保護這些路徑的 code。

## Content Review
PASS。沒有把 CIA 當完整課綱；沒有把 control 當 objective；Teaching Case 足以支撐 U2–U3 重訪。