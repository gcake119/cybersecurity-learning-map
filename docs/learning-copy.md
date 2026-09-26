# Cybersecurity Learning Map v2 — Learning Copy v0.1

> 日期：2026-09-26
> 狀態：Ready for implementation
> 原則：先白話、先觀察 consequence，再介紹術語；完整 correctness 以 Canonical Content 為準。

## Course landing

### Title
和 AI 一起做資安：從「看起來安全」到「有證據知道哪裡還不安全」

### Intro
你不需要先背漏洞清單，也不用先學一整套攻擊工具。

這門課會反覆問八個問題：

1. 什麼事情不能發生？
2. 什麼可能讓它發生？現在多值得先處理？
3. 跨過這條線後，哪些東西不能直接相信？
4. 這份資料到了下一站，會被當成什麼？
5. 如果一個元件已經失守，還能走多遠？
6. 資料、Secret、套件和部署產物要怎麼信任？
7. AI 說修好了，我們憑什麼相信？
8. 真的出事後，怎麼限制影響並恢復？

AI Agent 會幫你整理、追蹤、提出可能問題、執行工具和產生測試。你要學的是怎麼用系統行為與證據判斷它的答案。

## Unit 1｜什麼不能發生？

### Opening
文件功能都正常。

Alice 可以開自己的私人文件，也能分享給 Bob。

現在問一個不同的問題：

> 哪些結果一旦發生，你會認為這個系統的保護失敗了？

### Observe
切換「陌生人讀取」「viewer 修改」「服務中斷」，看哪個東西發生變化。

### Reveal
先找需要保護的東西。

**Asset（資產）**：如果它被看到、改掉、拿走或不能使用，會造成影響的資料、服務、身分或能力。

### CIA
看到的損害可以用三種常見語言描述：

- **Confidentiality（機密性）**：不該看到的人看到了。
- **Integrity（完整性）**：不該改的人改了，或狀態變得不正確。
- **Availability（可用性）**：需要使用的人在需要時不能使用。

一個事件可能同時影響不只一項。

### Scope
把文件從「私人」改成「公開」。

陌生人現在能讀到它，還算資料外洩嗎？

保護要求需要 scope。

### Summary
先問：

> 我在保護什麼？什麼結果不能接受？這個要求在哪些條件下成立？

再談 MFA、WAF、加密或其他解法。

## Unit 2｜有漏洞，就一定要先修嗎？

### Opening
Service A 和 B 都被掃到同一個高嚴重度漏洞。

你只有時間先處理一個。

只看分數夠嗎？

### Observe
打開「版本」「能不能從外部碰到」「是否已有實際利用訊號」「會影響什麼資料」四份 evidence。

### Terms
**Vulnerability（漏洞）**：可以被利用、讓安全要求失效的具體弱點。

**Threat（威脅）**：可能造成傷害的事件、情境或行動者。

**Risk（風險）**：這件事發生的可能性與發生後影響，在目前情境下合起來看。

### EPSS
EPSS 回答的是：

> 這個公開 CVE 在接下來 30 天被觀察到實際利用活動的機率估計。

它不知道你的 server 有沒有這個版本，也不知道你的資料有多重要。

### KEV
KEV 告訴你：

> 這個漏洞已經有確認的實際利用紀錄。

它也不是「catalog 外就安全」。

### Summary
漏洞資訊是 evidence。

最後仍要回到：

> 我真的受影響嗎？攻擊路徑碰得到嗎？後果是什麼？現在有什麼 mitigation？

## Unit 3｜登入成功，為什麼還不能直接相信？

### Opening
Alice 已經登入。

她把 URL 裡的文件 ID 從自己的 42 改成 Bob 的 73。

伺服器現在知道她是 Alice。

這足夠決定她能不能讀文件 73 嗎？

### Terms
**Authentication（身分驗證）**：確認「你是誰」。

**Authorization（授權）**：決定「你能不能對這個東西做這件事」。

### Observe
把權限檢查從「讀資料之前」移到「資料回傳之後」。

HTTP 最後仍然可以顯示拒絕，但資料已經離開 server。

### Trust boundary
**Trust boundary（信任邊界）**：

> 資料或要求跨到這裡後，接收端需要重新判斷哪些東西可以相信。

### Least privilege
Worker 只需要讀 thumbnail source。

為什麼它也能刪掉整個 bucket？

**Least Privilege（最小權限）**：只給完成工作真正需要的權限。

### Summary
每個 access 都問：

> 誰？要操作什麼？做什麼？為什麼允許？真正能阻止它的地方在哪？

## Unit 4｜這串文字到了下一站，會被當成什麼？

### Opening
同一串外部文字可以進：

搜尋條件、商品評論、檔案路徑、背景處理工作。

文字沒有變。

解讀它的東西變了。

### Observe
把資料分別送進 SQL、HTML、Path 與模擬的 process API。

看它是「資料」，還是開始改變 query structure、markup、destination 或 operation。

### Validation
**Input Validation（輸入驗證）**：

> 檢查這份資料是不是我們的業務真的接受的型別、範圍和格式。

它很重要，但不是所有 injection 的完整答案。

### Parameterization
搜尋資料不應自己變成 SQL structure。

**Parameterization（參數化）**：先固定 query structure，再把外部值當資料傳進去。

### Context
SQL 的保護不會自動保護 HTML。

每個 interpretation context 都要問自己的安全建構方式。

### Summary
不要只問「有沒有 sanitize」。

問：

> 這份資料下一站會被當成什麼？它能不能改變原本的結構或目的地？

## Unit 5｜先假設 API 已經失守

### Opening
這一章不問「怎麼防止 API 被攻破」。

先假設：

> API 現在已經不可信。

按下 Run，看它能沿著現有 credential、permission 和 network route 碰到哪裡。

### Blast radius
**Blast Radius（影響範圍）**：

> 從這個已失守的位置出發，在目前條件下還能影響哪些資源。

### Least privilege revisit
把 API 的 database credential 從 admin 改成只讀。

攻擊起點沒消失。

能做的事情變少了。

### Segmentation
**Segmentation（分段／隔離）**：限制不同系統區域之間可以直接建立哪些連線。

它不能取代資料庫自己的權限，但可以少掉一條攻擊路徑。

### Summary
安全設計也要問：

> 如果第一層真的失敗，下一層還剩下什麼保護？

## Unit 6｜「有加密」到底保護了哪一種情況？

### Opening
資料庫磁碟有加密。

把 threat 切成：

- 硬碟被拿走
- Application 已經被控制

看結果有沒有一樣。

### Reveal
加密放在哪一層，決定它能擋住哪一種 threat。

### Minimize
最少需要保存的敏感資料，就是最少需要保護的敏感資料。

**Data Minimization（資料最小化）**：只保存完成目的真正需要的敏感資料。

### Secrets
CI token 已經出現在公開 log。

把它從設定檔刪掉。

它現在失效了嗎？

不一定。

**Revocation（撤銷）**：讓舊 credential 不能再使用。

**Rotation（輪替）**：建立 replacement credential，並把使用者／服務切換過去。

### Supply chain
程式從 source code 一路經過 dependency、CI、artifact 到 deployment。

任何能替換其中一段的人，都可能改變最後執行的東西。

### Summary
信任不只存在 request path。

也存在：

> 資料從哪裡來？Secret 誰能拿？Dependency 從哪裡來？真正部署的是哪一份 artifact？

## Unit 7｜AI 說修好了，我們憑什麼相信？

### Opening
AI review 說：

> 這裡可能有安全問題。

Semgrep 出現一個 finding。

Security test 是綠色。

這三件事代表同一件事嗎？

### Evidence surface
打開不同 evidence source，看每一個能看到什麼。

### Semgrep
**SAST（靜態應用程式安全測試）**：在不靠 production 攻擊操作的情況下分析程式碼，尋找符合安全規則或資料流條件的問題。

Semgrep 的基本循環：

> rule → match → finding → 調查 → 修正 → 再掃一次

**Finding** 是「工具找到一個符合分析條件的地方」。

它需要調查。

### FP / FN
工具標到了，但不是我們要找的問題：

**False Positive（誤報）**。

真的有問題，但工具沒有找到：

**False Negative（漏報）**。

### Tests
安全測試回答的是特定行為。

例如：

> Alice 嘗試修改 Bob 的文件時，系統拒絕，而且資料沒有改變。

這比「403」多驗證了一個 side effect。

### Runtime
上線後還需要 evidence。

安全 log 至少要讓調查能回答：

> 什麼時候？在哪裡？誰？做了什麼？

不要把 password、token 或不必要的敏感內容一起寫進去。

### Summary
每次看到 AI 或工具的結論，都問：

> 它看了什麼？它能證明什麼？它看不到什麼？

## Unit 8｜真的出事了，現在先做什麼？

### Opening
Deployment credential 被偷了。

系統出現一筆不熟悉的 deployment，接著有大量資料讀取。

現在有一個 alert。

第一件事不是猜完整故事。

先分：

> 我們已經知道什麼？還不知道什麼？什麼傷害可能還在繼續？

### Containment
**Containment（限制影響）**：

> 先讓 incident 不要繼續往外擴大。

試著 revoke credential、隔離 service、縮小 permission。

每個動作都可能有 operational consequence。

### Recovery
把 code rollback 了。

被改過的資料會自動恢復嗎？

不會。

把 backup restore 了。

被偷的 credential 會自動失效嗎？

也不會。

**Recovery（恢復）**：重新建立一個可接受、而且有證據支持的可信運作狀態。

### Close the loop
最後把 incident 帶回：

- threat model
- permission
- security test
- scanner / review
- logging / alert
- response procedure

### Summary
Incident response 最後仍回到同一個問題：

> 我們憑什麼知道現在已經安全到可以恢復運作？

## Final

你會拿到一個完整 SaaS 系統。

不會告訴你這題屬於哪一章。

你可以和 AI Agent 一起分析，也可以使用課程提供的 evidence tools。

最後你需要說明：

- 你在保護什麼；
- 哪些 trust assumptions 最重要；
- 哪些 control 放在哪裡；
- 如果一層失守，影響能走多遠；
- 你用什麼 evidence 驗證；
- 出事時怎麼發現、限制與恢復；
- 還有哪些事情你不知道。

接著再把同一套方法帶到一個你熟悉的系統。