export interface Phase { id: number; title: string; subtitle: string; tags: string; color: "teal" | "ochre" | "olive" | "rust"; slide: number; goal: string; exercise: string }
export interface Slide { phase: number; title: string; intro: string; items: [string,string][]; task: string; source?: string }
const phaseRows: Array<[string, string, string, Phase["color"], number, string, string]> = [
['資安基本模型','先知道，要保護什麼','CIA · 資產 · 威脅與風險','teal',2,'描述資產、存取者與失敗後的影響。','選一項功能，列出不能洩漏、不能被改、不能中斷的資料或服務。'],
['漏洞資訊','看懂公告，判斷優先順序','CWE · CVE · CVSS · EPSS','ochre',4,'區分漏洞類型、漏洞編號、嚴重度與利用訊號。','找一個專案依賴的公告，核對版本、暴露面和修補方法。'],
['Linux 與 SSH','在伺服器上找到方向','Shell · 檔案 · Process','olive',5,'辨識現在操作的是本機、遠端主機或容器。','在練習目錄建立檔案，再登入自己的測試 VM 查看日誌。'],
['HTTP 與 Web 基礎','跟著一次請求穿過系統','Request · Cookie · curl','teal',6,'看懂請求與回應，理解前端限制的邊界。','在自己的測試站用 Network 觀察一個 API，再以 curl 重送。'],
['Web Security','找出系統信任的缺口','AuthN / AuthZ · 常見漏洞','rust',8,'用身分、權限和資料流理解攻擊成因。','比較兩個測試帳號，確認只能存取各自擁有的資源。'],
['攻擊實驗','把概念變成可觀察的證據','Burp Suite · Academy','ochre',10,'在授權靶場修改請求，解釋伺服器為何接受。','完成一個 Access control Lab，記下請求、結果與修補方向。'],
['Secure Development','把保護寫進日常開發','驗證 · 機密 · 日誌 · 相依套件','olive',11,'把攻擊條件轉成明確的設計與測試要求。','替一個 API 寫下身分、權限、輸入與日誌規則。'],
['Threat Modeling','沿著資料流找風險','資產 · 攻擊面 · 信任邊界','rust',12,'辨識資料跨越的邊界與每一段的信任假設。','畫出 PDF 上傳到解析的資料流，逐段寫下可能的失敗。'],
['Security Engineering','讓安全持續被驗證','安全需求 · CI · 監控 · 應變','teal',13,'把安全需求連到測試、部署和營運責任。','加入未授權請求測試，指定告警後的處理人與回復方式。']
];
export const phases: Phase[] = phaseRows.map(([title,subtitle,tags,color,slide,goal,exercise],i)=>({id:i,title,subtitle,tags,color,slide,goal,exercise}));
const slide=(phase: number,title: string,intro: string,items: [string,string][],task: string,source?: string): Slide=>({phase,title,intro,items,task,source});
export const slides: Slide[]=[
slide(0,'從看懂系統，開始學資安','沿著「資料如何被信任」學習，逐步建立能解釋、能驗證的安全判斷。', [['觀察','資料從哪裡來？誰可以操作？'],['判斷','哪些條件失效會造成影響？'],['驗證','用什麼測試證明保護有效？']], '選一個你熟悉的功能，作為整條路徑的練習案例。'),
slide(0,'先看全貌，再選起點','九個階段是一條建議學習順序。所有內容都可自由閱讀，Linux 與漏洞資訊也可同步補齊。',[['基礎 01—04','資安模型、漏洞語言、系統操作、HTTP'],['實驗 05—06','Web 信任關係與授權靶場'],['工程 07—09','安全開發、威脅模型、持續驗證']], '切回地圖，選擇最需要補齊的階段。'),
slide(0,'資安在保護什麼？','先描述你要保護的資產，再看事件會造成哪一種影響。',[['C · 機密性','個案資料只能由獲授權的人讀取。'],['I · 完整性','案件狀態不能被未授權地修改。'],['A · 可用性','工作人員需要時能使用案件系統。']], '為同一項功能各寫一個 CIA 失敗情境。'),
slide(0,'把問題說清楚','Bug、弱點、漏洞、威脅與風險描述不同面向，並非必然依序發生的階梯。',[['Bug / Weakness','Bug 是程式錯誤；弱點是可能造成漏洞的缺陷類型，CWE 提供分類。'],['Vulnerability / CVE','漏洞是可被利用的安全缺陷；CVE 為公開揭露的漏洞提供識別編號，並非每個漏洞都有 CVE。'],['Threat / Risk','威脅是可能造成傷害的來源或事件；風險需考量發生可能性與影響。']], '用「缺少物件權限檢查」說明缺陷、利用條件與可能影響。','https://cwe.mitre.org/'),
slide(1,'哪個漏洞先修？','排序需要結合部署情境；單一分數不能代表你的實際風險。',[['CWE / CVE / EUVD','CWE 分類弱點；CVE 識別漏洞；EUVD 提供歐盟漏洞資訊，需核對受影響版本與公告。'],['CVSS / EPSS','CVSS 描述技術嚴重度；EPSS 預測公開 CVE 未來 30 天在野被利用的機率。'],['KEV / 實際暴露','KEV 記錄已確認在野利用的漏洞。再核對版本、可達性、資產重要性與緩解措施。']], '挑一個依賴公告，寫下是否受影響、修補優先序與理由。','https://www.first.org/epss/faq'),
slide(2,'先知道，自己在哪裡','同樣的指令在本機、遠端與容器裡，會作用於不同的環境。',[['定位與閱讀','pwd、ls、cd；用 cat、less、tail 閱讀檔案與日誌。'],['建立與移動','在練習目錄使用 mkdir、cp、mv，操作前先確認路徑。'],['SSH 與程序','ssh user@host 登入遠端；核對主機指紋，以 ps 觀察程序。']], '在自己的 VM 讀取一段日誌，說明它來自哪個服務。','https://www.openssh.com/manual.html'),
slide(3,'跟著一次 HTTP 請求','瀏覽器送出 Request；伺服器檢查、處理後回傳 Response。', [['Request','GET /api/cases/42 HTTP/1.1\nHost: demo.example\nCookie: session=demo'],['Server','確認身分 → 檢查案件權限 → 讀取資料'],['Response','HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":42,"status":"open"}']], '在 Network 找到 Method、Header、Body、Status Code 與 Set-Cookie。','https://developer.mozilla.org/en-US/docs/Web/HTTP'),
slide(3,'UI 限制需要後端保護','請求可以直接由工具送出。停用按鈕與隱藏欄位，需要搭配伺服器端驗證。',[['觀察','DevTools → Network → 選取請求 → Headers / Payload / Response'],['重送','curl -i https://example.com\n用 -H 設定 Header、-d 傳送資料、-b 帶入 Cookie。'],['確認邊界','WAF 可檢查 Web 流量；IDS 偵測、IPS 可阻擋。它們不能取代應用程式權限檢查與更新。']], '在自己的測試環境用未授權帳號呼叫 API，確認沒有洩漏或修改資料。','https://curl.se/docs/tutorial.html'),
slide(4,'系統信任了什麼？','把登入、持續識別、資源權限與資料處理分開理解。',[['Authentication · 你是誰','驗證身分；Session / Cookie 讓後續請求帶上身分憑證。'],['Authorization · 可以做什麼','每次操作都核對角色、資源歸屬與租戶邊界。'],['資料與瀏覽器邊界','輸入依規格驗證，輸出依情境編碼。Same-Origin Policy 限制跨來源讀取；CORS 不是 API 權限驗證。']], '列出「已登入，但仍不該允許」的三種操作。','https://owasp.org/www-project-web-security-testing-guide/'),
slide(4,'從信任缺口理解漏洞','每一種漏洞都要能解釋：哪裡接受了不該信任的資料或操作。',[['瀏覽器','XSS：資料被當作腳本執行。CSRF：瀏覽器自動攜帶憑證，非預期請求被接受。'],['解譯器與檔案','SQLi：資料改變查詢結構。Path Traversal：路徑離開允許範圍。上傳：檔案類型、大小或執行權限未受控。'],['伺服器與資源','SSRF：伺服器請求非預期目的地。存取控制缺陷：資源操作未驗證使用者權限。']], '選一種漏洞，畫出輸入位置、信任缺口與影響；再用 OWASP Top 10 分類整理。','https://portswigger.net/web-security'),
slide(5,'把請求留住，再做實驗','只在自有測試環境或明確授權的 Academy 靶場練習。',[['Proxy / HTTP history','讓測試瀏覽器經過代理，觀察送出的流量與回應。'],['Repeater / Decoder','複製請求、每次只改一個條件；辨識資料編碼與伺服器反應。'],['Academy Lab','先從 Authentication 與 Access control 入門，再進 SQLi、XSS、CSRF 與檔案類漏洞。']], '完成一個入門 Lab，記錄原請求、修改點、結果及保護方法。','https://portswigger.net/web-security/learning-paths'),
slide(6,'把攻擊條件變成開發要求','安全措施要有明確落點，也要留下可驗證的行為。',[['身分與權限','選擇適合的 Session / Token 機制，理解 OAuth 授權與 OIDC 身分驗證；落實 RBAC 與物件層級檢查。'],['資料與機密','伺服器 Schema 驗證、參數化查詢、情境化輸出編碼、TLS、機密管理與敏感資料最小化。'],['依賴與營運','維護套件與 SBOM、修補漏洞、限制服務暴露；記錄安全事件，同時避免日誌寫入 Token 或個資。']], '把「只有案件負責人可以修改」轉成後端規則、拒絕測試與必要日誌。','https://owasp.org/www-project-application-security-verification-standard/'),
slide(7,'沿著資料流找風險','以 PDF 上傳為例，資料每跨越一個信任邊界，都需要重新確認可接受的條件。',[['使用者 → Upload API','驗證身分、權限、檔案大小與允許格式。'],['Storage → Parser','限制檔案存取，隔離解析程序，限制 CPU、記憶體與執行時間。'],['Parser → Database','把解析結果當成不可信輸入；核對欄位、案件歸屬與人工確認條件。']], '用 STRIDE 檢查冒充、竄改、否認、資訊洩漏、阻斷服務與提權，挑出最高優先風險。','https://owasp.org/www-community/Threat_Modeling'),
slide(8,'讓安全持續被驗證','把「必須保證什麼」連到規格、測試與營運，讓後續 AI 改動也受到約束。',[['設計前','需求 → 威脅模型 → 安全需求 → 設計決策'],['實作中','TDD → 實作 → 安全測試 → AI review → 人工驗收'],['部署後','CI 檢查 → 安全設定 → 監控告警 → 事件應變與回復演練']], '替一個安全要求指定測試證據、檢查頻率與失敗後的處理方式。','https://owasp.org/www-project-samm/'),
slide(3,'Web 開發者，從這裡走','優先補齊直接影響 Web 系統判斷的概念，Linux 與漏洞公告可同步練習。',[['先理解請求','HTTP → 身分 / 權限 → Cookie / Session'],['再觀察失敗','Web 漏洞 → Burp / Academy'],['帶回自己的工程','安全開發 → 威脅模型 → 安全測試與 Review']], '切換地圖的「Web 開發者優先」，從 HTTP 節點開始。'),
slide(8,'第一輪：驗證一個功能','選擇測試環境的「查詢或修改案件」，走完一輪即可。',[['01 · 觀察與描述','找到 API 請求，列出身分、資源、允許操作與 CIA 影響。'],['02 · 改變條件','用未登入、不同權限與不同資源歸屬的測試帳號送出請求。'],['03 · 留下證據','確認拒絕且沒有資料副作用；把結果寫進測試與規格，整理未驗證的範圍。']], '完成後標記此主題，回到地圖選下一個要補齊的概念。')
];
