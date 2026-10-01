import type {UnitId} from './model';
export type Reading = {title:string;paragraphs:string[];mode:'INTERACT'|'PRACTICE';sources:{label:string;url:string}[]};
export const readings:Record<UnitId,Reading[]> = {
  "1": [
    {
      "title": "先觀察，再描述損害",
      "paragraphs": [
        "文件內容與服務都是需要保護的東西。被讀取、被改動與不能使用是不同結果；先問誰原本應該有權限，再判斷是否違反要求。",
        "例如公開文件被陌生人讀取符合分享政策；同一人修改文件卻不一定被允許。切換事件時，注意文件和服務節點，而不是只看顏色。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Threat Modeling",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "把要求和做法分開",
      "paragraphs": [
        "「私人文件不能被陌生人讀」說明需要維持的結果；「使用某個登入工具」只是可能的做法，還沒有證明它保護哪個結果。",
        "這裡產生的目標句是候選需求，不會改變實際分享政策。改變角色、資源與必要使用時間，對照目標句與節點後果是否一致。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Threat Modeling",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "AI 提案需要哪一種依據",
      "paragraphs": [
        "能直接描述不可接受結果的提案，仍要確認業務範圍；「全部文件都受法規保護」則需要另外查證，不能由 AI 自行決定。",
        "把提案歸到做法時，繼續問它想避免什麼結果。分類會改變提案與依據的關係，不會自動改寫文件政策。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Threat Modeling",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "公開讀取不代表公開修改",
      "paragraphs": [
        "分享範圍是允許讀取的條件。條件改變後，要重新檢查原安全要求；不能把所有陌生人讀取都稱為外洩。",
        "保留你的其他設定，只把私人改為公開，先比較讀取，再比較修改。能讀不代表能編輯。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Threat Modeling",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
        }
      ]
    }
  ],
  "2": [
    {
      "title": "版本、路徑與後果要一起看",
      "paragraphs": [
        "套件通知說某些版本有漏洞，不代表每台系統都具有相同攻擊路徑。先確認使用的版本，再確認要求能否碰到弱點，以及成功後會影響什麼。",
        "本圖只比較已設定的路徑，沒有計算真實利用機率。A 的緩解是本轮已查核有效的控制；不要把這個假設擴大到其他入口。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "FIRST EPSS FAQ",
          "url": "https://www.first.org/epss/faq"
        }
      ]
    },
    {
      "title": "每份來源回答不同問題",
      "paragraphs": [
        "CVE 是公開漏洞的識別編號；CVSS 描述技術嚴重度；EPSS 估計未來 30 天被觀察到利用活動的機率；KEV 是已確認實際利用的紀錄。它們都不知道你的完整部署。",
        "Vendor advisory 是供應者通知，local inventory 是本機元件與版本清單。先用兩者確認「我有沒有這個版本」，再接可達路徑與資料後果；不要用單一分數代替這條判斷鏈。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "FIRST EPSS FAQ",
          "url": "https://www.first.org/epss/faq"
        }
      ]
    },
    {
      "title": "原排序會因條件而改變",
      "paragraphs": [
        "B 新增公開入口後，原本未接觸弱點的路徑可能可達；A 有有效緩解後，其本輪路徑的處理理由也會改變。",
        "先看變動的路徑，再比較資料後果與仍缺的證據。沒有對外不等於永遠不可達，還要確認內部工作或其他入口。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "FIRST EPSS FAQ",
          "url": "https://www.first.org/epss/faq"
        }
      ]
    }
  ],
  "3": [
    {
      "title": "身分與允許操作是兩個判斷",
      "paragraphs": [
        "Browser 是發出要求的瀏覽器，API 是伺服器受理要求的入口，resource 是被讀取或修改的資料。登入可以確認是 Alice，仍要核對文件是否允許 Alice 做這次操作。",
        "本輪故意把檢查放得太晚：最後顯示拒絕時，資料可能已回傳或修改。開啟讀寫前檢查，觀察 resource 的副作用是否消失，不能只看拒絕回應。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "背景工作也有身分與能力",
      "paragraphs": [
        "Worker 是替人執行背景工作的程序。它使用 service identity（服務身分）取得特定能力，不應因為來自內網就能操作全部文件。",
        "Scope 是允許的資源與操作範圍。只需要讀指定來源的工作，與可读寫全部資料的工作，失敗後的後果不同。沒有明確允許條件時，預設拒絕仍需保留合法工作路徑。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "能阻止副作用的位置才有效",
      "paragraphs": [
        "Batch job 是批次處理入口。它繞過原 API 時，原本只放在 API 的檢查不會跟著生效；有登入與有 API 檢查仍不足。",
        "把相同資源政策放在涵蓋所有權威讀寫的位置，才能阻止批次入口的越界修改。本模型的集中資源處只是示例，不表示真實系統必須採同一架構。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    }
  ],
  "4": [
    {
      "title": "資料到了哪個解讀位置",
      "paragraphs": [
        "SQL 是資料庫查詢語言，HTML 是網頁結構，path 是檔案位置，process 是執行中的程序。同一資料到了不同元件，可能被解讀成查詢結構、頁面標記、目的地或操作內容。",
        "本圖的結構標記只改合成模型，不執行真正指令。先試一般文字，再試標記，觀察下一站的結構或目的地；資料存過資料庫也不代表下一站可直接相信。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Injection Prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "業務驗證與安全建構各管一件事",
      "paragraphs": [
        "輸入驗證檢查型別、範圍與業務規則，例如數量必須是正整數；合法自由文字仍可能包含特殊符號。安全建構則要讓這些值保持資料，不能改變解讀器的原結構。",
        "固定 SQL 結構、把值獨立傳入，只保護查詢位置。HTML 需要對應輸出方式，檔案需要限制目的地，程序需要固定操作與獨立參數；依 API 保證查證，不把一種控制當成全部防護。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Injection Prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "安全與功能都要成立",
      "paragraphs": [
        "Rich text 是需要保留格式的內容，例如粗體或連結。只輸出純文字可以避免活動標記，卻也拿掉功能需要的格式。",
        "本模型的允許內容規則只保留指定結構。比較純文字與允許規則時，同時看解讀器是否受外部值改變、畫面是否完成格式需求；本課不教完整富文字處理實作。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Injection Prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html"
        }
      ]
    }
  ],
  "5": [
    {
      "title": "起點已失守，還有哪些條件限制它",
      "paragraphs": [
        "本章接前一章的允許規則，先假設 API 或 Worker 已被控制，不再估算能否攻破它。Credential（憑證）是用來取得身分或能力的值，route 是可建立的連線路徑。",
        "攻擊者繼承起點能用的憑證與連線，但下游自己的權限仍可能阻擋操作。看「碰得到」和「能做什麼」兩件事，而不是看到連線就認定全部失守。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "網路可達不等於有修改權限",
      "paragraphs": [
        "分段限制連線，最小權限限制允許的操作。兩者在不同邊界生效，不能互相取代；共用高權限憑證可能把多個元件連成同一組能力。",
        "例如資料庫仍可達，但身分只讀時，讀取仍可能發生，修改或刪除能力才被縮小。比較節點上的具體操作，別只數被阻擋的線。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "合法工作也需要路徑",
      "paragraphs": [
        "背景工作現在必須寫出一個縮圖。完全封鎖儲存空間雖可阻擋這條路徑，也讓工作無法完成。",
        "改為只讀寫指定物件，再觀察剩餘能力與正常工作結果。影響範圍是明示假設下的資源與操作，不是安全分數。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Authorization",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
        }
      ]
    }
  ],
  "6": [
    {
      "title": "誰還能取得解密能力",
      "paragraphs": [
        "靜態加密保護儲存層；傳輸中加密保護傳輸層。本圖先比較磁碟被拿走與執行中應用被控制：後者如果能取得明文或呼叫解密，資料仍可能被讀取。",
        "Key 是解密需要的金鑰。把金鑰放別處，只有在失守身分也不能讀它或使用解密能力時才擋住這條路徑。少保存非必要敏感欄位則直接减少本輪可暴露資料。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Cryptographic Storage",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Secrets Management",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Software Supply Chain",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "刪原文、換新值、撤銷舊值",
      "paragraphs": [
        "Token 是可取得特定能力的憑證；consumer 是實際使用它的服務或工作。公開副本已被複製時，刪除原文不會使副本失效。",
        "建立替代值是輪替的一部分，撤銷才讓舊值失效；consumer 還必須切換到新值。縮小 token 範圍也只縮小能力，不自動撤銷它。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Cryptographic Storage",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Secrets Management",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Software Supply Chain",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "軟體交付不是只看套件名稱",
      "paragraphs": [
        "Dependency 是依賴套件，CI 是自動建置／檢查流程，artifact 是建置後可部署的產物。誰能替換其中一段，可能改變最後執行內容。",
        "Provenance（來源證據）幫你核對產物從哪裡來；來源吻合仍不能證明程式無漏洞。套件通知也需要核對版本與實際使用路徑，不能直接當本部署可被利用的證明。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Cryptographic Storage",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Secrets Management",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Software Supply Chain",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"
        }
      ]
    },
    {
      "title": "舊值失效與工作可用要一起驗證",
      "paragraphs": [
        "Consumer 沒切換時就撤銷舊 token，可能阻止洩漏副本，也同時中斷合法工作。這是兩個要分開觀察的結果。",
        "試著建立替代值、更新 consumer，再撤銷舊值；比較外洩副本是否仍可用與合法工作是否能繼續。本圖不模擬真實 provider 的切換時間。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Cryptographic Storage",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Secrets Management",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        },
        {
          "label": "OWASP Software Supply Chain",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"
        }
      ]
    }
  ],
  "7": [
    {
      "title": "先說清想證明的主張",
      "paragraphs": [
        "Claim 是想驗證的主張，例如 Alice 不能改 Bob 的文件。SAST 分析程式碼線索；SCA 檢查依賴組成與版本；secret scan 找疑似秘密字串；行為測試檢查指定操作與副作用。",
        "工具 finding（發現）是符合規則的結果，需要調查。這個畫面是固定合成規則，不執行真實 Semgrep；啟用不同來源只改可見證據，不會自動修正缺陷。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Logging",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
        },
        {
          "label": "Semgrep CLI reference",
          "url": "https://docs.semgrep.dev/cli-reference"
        }
      ]
    },
    {
      "title": "修正後，仍要看未涵蓋的地方",
      "paragraphs": [
        "Query 是查詢內容；fixture 是示範測試資料；sink 是資料進入敏感操作的位置。相似字串建構不代表兩者有相同風險，要追來源與用途。",
        "修正 query 後，對照 match 是否消失，再看 fixture 的適用性與重複退款仍未涵蓋的業務規則。誤報是標到非目標問題；漏報是目標問題存在但沒找到。沒有 finding 不能擴大成全部安全。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Logging",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
        },
        {
          "label": "Semgrep CLI reference",
          "url": "https://docs.semgrep.dev/cli-reference"
        }
      ]
    },
    {
      "title": "紀錄能連起事件，警示仍需調查",
      "paragraphs": [
        "Log 是發生事情留下的紀錄，alert 是規則指出需要調查的訊號。時間、入口、身分與操作欄位幫你知道發生什麼；interaction ID 用來關聯同一操作跨服務的紀錄。",
        "加上關聯資訊後觀察可重建的範圍，不要猜完整故事。密碼、token 與不必要敏感內容不應直接寫入 log；紀錄本身也需要保護。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "OWASP Logging",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
        },
        {
          "label": "Semgrep CLI reference",
          "url": "https://docs.semgrep.dev/cli-reference"
        }
      ]
    },
    {
      "title": "綠燈只屬於受測條件",
      "paragraphs": [
        "負向測試驗證禁止行為被拒絕且資料沒變；回歸測試讓已修正行為在後續變更仍成立。這裡的 API 測試只驗證一条入口。",
        "新增背景工作後，API 綠燈仍可能成立，卻沒有驗證新的工作入口。Coverage（涵蓋範圍）是證據實際查過的路徑與條件，不能因工具一致就自動擴大。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "OWASP Logging",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
        },
        {
          "label": "Semgrep CLI reference",
          "url": "https://docs.semgrep.dev/cli-reference"
        }
      ]
    }
  ],
  "8": [
    {
      "title": "有線索，仍要保留未知",
      "paragraphs": [
        "先接 U7 的事件紀錄。身分使用紀錄、資源紀錄與可關聯時間，各自補上事件的一部分；警示不是完整故事。",
        "先列出受影響身分、資源與時間哪些有證據，再選限制持續傷害的動作。不需要等所有未知都解開，但每個動作要說清依據與可能副作用。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "NIST SP 800-61r3",
          "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
        }
      ]
    },
    {
      "title": "停止新部署與停止既有程序不同",
      "paragraphs": [
        "撤銷部署憑證可阻止它繼續發布，但已執行的未知程序可能仍有資料權限。隔離服務可限制這條路徑，卻會影響合法使用。",
        "Containment（限制影響）是在止住持續或擴大的傷害，還沒有證明資料與產物可信。比較撤銷、隔離與縮小資料能力各改了哪條路徑。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "NIST SP 800-61r3",
          "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
        }
      ]
    },
    {
      "title": "可信恢復需要多份證據",
      "paragraphs": [
        "Rollback 是把程式換回舊版本，restore 是還原資料；兩者都不會自動撤銷外洩憑證。重新部署已核對來源的產物，也需核對下游秘密與資料狀態。",
        "本圖分開列出產物、憑證、資料與可用性。還原後另驗完整性與時間點，確認持續路徑受控，再請求恢復；本輪 gate 只支持畫面列出的假設。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "NIST SP 800-61r3",
          "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
        }
      ]
    },
    {
      "title": "讓同類問題可再次查核",
      "paragraphs": [
        "回歸測試檢查已修正行為能否維持，偵測規則觀察運作訊號，權限修訂減少能力，threat model 則記錄系統與威脅假設。",
        "四者作用不同。回到本次已知原因與證據，說明哪項改變能阻止或發現同類路徑；新增一個測試不等於全部事件已涵蓋。"
      ],
      "mode": "INTERACT",
      "sources": [
        {
          "label": "NIST SP 800-61r3",
          "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
        }
      ]
    },
    {
      "title": "備份還原只是其中一步",
      "paragraphs": [
        "備份存在不代表還原結果完整或足夠新；還原也不會終止仍有效的憑證或執行中程序。",
        "只打開 restore 時，檢查哪些可信條件仍缺。逐項補上並再次觀察可用性與事件路徑，保留本輪未驗證的未知。"
      ],
      "mode": "PRACTICE",
      "sources": [
        {
          "label": "NIST SP 800-61r3",
          "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
        }
      ]
    }
  ]
};
