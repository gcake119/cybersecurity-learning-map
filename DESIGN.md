---
name: Cybersecurity Learning Map v2
description: 既有 v2 教材的互動色彩、狀態與可讀性規範
colors:
  ink: "#183339"
  paper: "#f6f8f2"
  surface: "#fdfefd"
  action: "#184e4e"
  action-hover: "#123f3f"
  action-active: "#0e3333"
  on-action: "#f6f8f2"
  control-hover: "#e5eeea"
  control-active: "#d4e2dc"
  control-border: "#657e72"
  disabled-ink: "#405957"
  disabled-surface: "#e5ebe7"
  focus: "#a34c12"
typography:
  body:
    fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif'
    fontSize: "16px"
    lineHeight: 1.6
rounded:
  control: "8px"
  canvas: "12px"
spacing:
  control-gap: "8px"
  control-padding: "10px 14px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.control}"
    padding: "{spacing.control-padding}"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.on-action}"
  button-primary-active:
    backgroundColor: "{colors.action-active}"
    textColor: "{colors.on-action}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  button-secondary-hover:
    backgroundColor: "{colors.control-hover}"
    textColor: "{colors.ink}"
  button-secondary-active:
    backgroundColor: "{colors.control-active}"
    textColor: "{colors.ink}"
  button-disabled:
    backgroundColor: "{colors.disabled-surface}"
    textColor: "{colors.disabled-ink}"
---

## Overview

**Creative North Star: "看得清楚，再判斷證據"**

沿用既有淺色教材。學習者在日常室內光線下，用桌面或手機逐步改變條件；控制應容易辨識，圖上的後果應可閱讀。這是 presentation 層規範，不改課綱、模型、URL 狀態或私人紀錄政策。產品依據見 PRODUCT.md、docs/implementation-v2.md。

本文件是互動元件的持久規範；實作位於 src/v2/v2.css。色彩採既有 sRGB hex 系統，避免為可讀性修正引入全站色彩空間遷移。token 名稱對應 CSS custom properties。

## Colors

**The Paired Color Rule.** 每個互動狀態都同時指定 foreground（文字）與 background（背景），不可只改背景後繼承頁面文字。深綠 action 僅搭配 on-action 淺色文字；其餘控制採 ink 深色文字與淺色表面。內部「開／關」標籤繼承元件成對色彩。

一般互動文字，包括小字、hover、active、focus、selected，對比至少 4.5：1。控制邊界及 focus 指示對相鄰背景至少 3：1。停用文字雖為 WCAG 例外，本教材仍要求 4.5：1，不以透明度弱化閱讀。

依據：[WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)、[Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)、[Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)。以上是本專案元件規則，不宣稱完整 WCAG 認證。

## Typography

沿用系統繁體中文字型與 16px／1.6 正文。選單 14px；mobile 階段與工具列 13px。不得因文字較小而降低對比要求。控制內文可換行，最小高度 44px；保留既有標題層級。

## Elevation

沿用平面表面與細邊界，不新增陰影或動態裝飾。focus 是 3px 實線、3px 外移的焦點框，使用 focus token；offset 讓深色選取元件的框落在外側淺色表面上。

## Components

### Buttons、link-buttons、toggle、stage navigation

| 元件／狀態 | Foreground token | Background token | 其他辨識 |
| --- | --- | --- | --- |
| 一般按鈕／select：default、focus | ink | surface | control-border；8px 圓角 |
| 一般控制：hover | ink | control-hover | 不改動語意或選取 |
| 一般控制：active（按住） | ink | control-active | 放開後恢復 |
| 主要 CTA、selected stage、toggle 開：default、focus | on-action | action | action 邊界 |
| 填色控制：hover | on-action | action-hover | 保持填色與文字可讀 |
| 填色控制：active | on-action | action-active | 保持填色 |
| 按鈕／select：disabled，含 hover／active | disabled-ink | disabled-surface | 虛線邊界、原生 disabled、opacity 1 |
| toggle 關／非目前 stage | ink | surface | aria-pressed=false／沒有 aria-current |

focus 不覆蓋既有 foreground/background，只加焦點框。selected 由 aria-current=step 或 aria-pressed=true 表達；toggle 另有「開／關」文字。CTA 是 RouterLink，仍保留原生連結語意。不能用 CSS 的 disabled 外觀假冒禁用連結；目前教材沒有 disabled link，若日後需要必須連同互動語意實作。

### Links、course links、summary

一般導覽連結與 summary：default／focus 用 ink 配所在 paper／surface；hover 用 ink 配 control-hover，加底線；active 用 ink 配 control-active，加底線。課程清單連結 default 用 surface 與 control-border。正文／導覽連結的 route-active 不代表 stage selected；selected 規範僅適用明示選取元件。summary 展開狀態由原生 disclosure marker 與 aria／原生語意識別。

### Select

關閉的 select 採一般控制狀態；選中的值沿用同一 foreground/background。展開選項由作業系統繪製，不用 CSS 自製選單取代鍵盤操作；原生 popup 顏色須另外驗證。當前教材沒有 disabled select，但共用 disabled 規則適用。

### Canvas、responsive、motion

保留既有兩欄工作區、1000px 節點收斂與 700px 單欄工作區。保留模型狀態、節點／連線文字、拖曳的 select 等效操作與 reduced-motion。Final 控制較多，允許垂直捲動，不允許水平溢出。loading／error 非目前同步本機控制的元件狀態；新增非同步行為需補規範，不虛構目前已有功能。

## Do's and Don'ts

- **Do** 以低 specificity（CSS 選擇器優先權）的頁面連結預設，讓元件與語意狀態明確定義色彩。
- **Do** 對 Unit 1–8、Transfer 與 Final 的真實 rendered foreground/background 做回歸檢查，包含子標籤與 pointer／keyboard 狀態。
- **Do** 同時保存測量、viewport、截圖與 NOT TESTED 邊界。
- **Don't** 使用較高優先權的頁面 a 規則覆蓋填色 CTA；不要用 !important 堆疊修補。
- **Don't** 只改背景、降低整體透明度或只靠顏色表達選取。
- **Don't** 新增只有術語清單、答案卡、一次揭露全部控制、私人學習進度與安全分數。
