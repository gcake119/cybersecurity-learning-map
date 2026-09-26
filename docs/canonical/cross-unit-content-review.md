# Cross-unit Content Review — v0.1

> 日期：2026-09-26
> 結果：**PASS with storyboard constraints**
> 範圍：Unit 1–8 Canonical Content
> 下一 gate：Interaction Storyboard

## 1. Review conclusion

八個單元形成一條完整 AI-assisted Security Engineering reasoning chain：

```text
1 什麼不能發生？                         security objectives
  ↓
2 什麼可能造成問題、現在多重要？          threat / contextual risk
  ↓
3 跨邊界時誰能對什麼做什麼？              trust / identity / authorization
  ↓
4 資料進入不同 interpreter 時會變成什麼？  interpretation boundaries
  ↓
5 假設一層已失守，還能走多遠？             privilege / blast radius
  ↓
6 資料、secret、dependency、artifact 怎麼信任？ supply chain / lifecycle
  ↓
7 我憑什麼說保護有效、怎麼發現失效？        verification / detection
  ↓
8 出事後怎麼限制、恢復、避免重演？          response / recovery
```

沒有 material issue 需要回 Curriculum Gate。

## 2. Cross-unit boundaries

### U1 vs U2
- U1 定義 unacceptable consequence / security objective。
- U2 才加入 threat likelihood / exposure / vulnerability evidence 與 prioritization。
- 不在 U1 用 CVSS 或 attack likelihood 決定 asset importance。

### U2 vs U7
- U2 的 scanner/advisory 是 vulnerability-management evidence。
- U7 教「不同 evidence source 能證明什麼」，包含 scanner coverage。
- U7 不重新教 CVSS / EPSS / KEV。

### U3 vs U5
- U3：在正常 request / policy model 下誰被允許做什麼。
- U5：假設某 identity/component 已 compromised 後，現有 permission / credential / route 讓影響走多遠。
- 「compromised」不代表 downstream authorization 全部失效。

### U3 vs U4
- U3 問 authority。
- U4 問 interpretation。
- 一個 request 可以 authorization 正確但仍有 injection；也可以 input handling 安全但越權。

### U5 vs U6
- U5 聚焦 runtime identities / permissions / reachability。
- U6 聚焦 data / secret lifecycle 與 software creation/delivery chain。
- Secret scope 可在 U5 首次使用；完整 lifecycle 在 U6。

### U6 vs U7
- U6 定義 dependency / secret / artifact trust problem。
- U7 教 scanner / tests 如何取得 evidence。
- 工具不提前成為 U6 的主線。

### U7 vs U8
- U7：verification / detection evidence。
- U8：evidence 出現後的 containment / recovery decision。
- Logging 在 U7 定義；U8 使用，不重教 log schema。

## 3. Terminology consistency

| Term | Course meaning | Learner-first wording |
| --- | --- | --- |
| asset | 需要保護、對人／組織／系統有價值的 resource / capability | 「如果它被看到、改掉、拿走或不能用，會造成什麼影響？」 |
| security objective | 指定 scope 下要維持的安全結果 | 「這件事不能發生」 |
| threat | 可能造成 harm 的 circumstance / event / actor | 「什麼可能讓這個要求失效？」 |
| vulnerability | 可被利用而違反安全要求的具體弱點 | 「系統哪裡留下可被利用的缺口？」 |
| risk | likelihood / context 與 impact 的綜合判斷 | 「這件事在我們現在的環境有多值得先處理？」 |
| trust boundary | 需要重新做 trust decision 的交界 | 「資料／要求跨到這裡後，哪些不能直接相信？」 |
| authentication | 建立／確認 identity | 「你是誰？」 |
| authorization | 判斷可否對 resource 做 action | 「你可以對這個東西做這件事嗎？」 |
| least privilege | 只給完成工作需要的權限 | 「它只需要讀，為什麼也能刪？」 |
| interpretation boundary | 資料進入 parser/interpreter 後取得新語意的位置 | 「這串資料到這裡會被當成什麼？」 |
| compromise | 某 identity/component 的 trust assumption 已失效 | 「先假設這個元件已經被控制」 |
| blast radius | 指定 compromise 下可受影響的 bounded scope | 「從這裡還能碰到哪裡？」 |
| finding | tool rule / analysis 產生的結果 | 「工具找到一個需要調查的 match」 |
| evidence | 支持／反駁 security claim 的可檢查結果 | 「我們憑什麼這樣判斷？」 |
| containment | 限制 incident 繼續擴散／傷害 | 「先讓問題不要再往外走」 |
| recovery | 重建可接受且可驗證的 trusted state | 「怎麼確認可以安全恢復運作？」 |

## 4. Recurring teaching cases

### Shared Document System
U1 objective → U3 authorization → U5 compromised service / blast radius → U7 evidence → U8 abnormal bulk access incident。

每次重訪必須標明「這次換了哪個問題」，不能讓 learner 誤以為前章漏教。

### Simple E-commerce Web App
U4 interpretation contexts → U6 CI/dependency/secret chain → U7 scanner / tests。

### Three-tier SaaS
U5 runtime reachability / identity；可在 Final integrated case 擴成 CI/CD + logs，但不提前把 Final 答案暴露。

## 5. Transfer progression

Transfer 只用使用者接觸過的 domain，且不提示章節名稱／答案：
1. U1 Sim-sik / 衛生局：security objectives。
2. U2 Podcast/self-hosting：advisory context。
3. U3 Sim-sik / 衛生局：subject-resource-action。
4. U4 VocaScript / document-engine：sources / sinks。
5. U5 multi-service VM：compromised component reach。
6. U6 automated publishing / GitHub Actions：secret/dependency/artifact chain。
7. U7 AI-assisted workflow / case system：claim-evidence mapping。
8. U8 self-hosted service：credential compromise / trusted recovery。
9. Final：learner 自選一個熟悉系統，無 mechanism hints。

## 6. AI collaboration cross-unit rule

AI Agent 不另成一章，也不作「答案機」：
- enumerate / summarize / trace / propose / run tools；
- learner 回到 requirements / architecture / code / tool evidence / runtime evidence 判斷；
- Agent claim 必須能指出 assumption 與 evidence；
- 不因 AI review 與 scanner 同意就宣告 secure。

## 7. Tool-depth constraints

核心工具概念只教到：
- 能選對 evidence tool；
- 基本執行／讀 finding；
- triage；
- fix / rerun；
- 理解 scope / FP / FN / coverage。

Semgrep 是 U7 主要 teaching tool，但不把 vendor-specific UI / proprietary feature 當 security principle；複雜 rule authoring 不列核心。

Burp / curl / DevTools 可作 supplemental authorized observation tools；Kali / exploit tooling 不進核心。

## 8. Storyboard hard constraints

1. 先看 consequence，再命名術語。
2. 每個 Unit 必須有 learner-controlled parameter。
3. parameter change 必須改 deterministic model state。
4. consequence 必須標回 node / edge / resource / evidence，不只文字 feedback。
5. 每章至少一次改 constraint 後原 control 不再充分。
6. Teaching case 與 Transfer domain 分離。
7. Transfer 不提示 mechanism 名稱。
8. synthetic data / probabilities / paths 明示 assumptions。
9. U4 不提供可直接用於未授權攻擊的 exploit recipe。
10. U7 scanner model 要包含至少一個 true positive、false positive / non-applicable finding、以及 scanner miss / uncovered business-logic issue。
11. U8 不用「incident score」；顯示 known/unknown、active paths、contained paths、recovery evidence。
12. System Design Simulator 只提供 component interaction / animation / consequence-visualization reference；各章 model 依 security mechanism 建立。

## 9. Gate decision

**Cross-unit Content Review：PASS。**

下一階段進 Interaction Storyboard；尚未修改 production UI。