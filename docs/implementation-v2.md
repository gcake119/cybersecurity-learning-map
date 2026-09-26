# Implementation v2

> 日期：2026-09-26
> Branch: `learning-map-v2`
> 狀態：Implementation first pass complete; Technical QA BLOCKED BY EXECUTION ENVIRONMENT

## Implemented

- 獨立 `#/v2` landing 與 unit routes；legacy routes 保留。
- Unit 1–8 course metadata。
- Unit 1–8 deterministic pure security models。
- 每章 learner controls → model state → visible node / metric / consequence。
- 每章 Transfer domain。
- Responsive layout / reduced-motion CSS。
- v2 model regression tests。
- `pnpm test` script 串 existing model tests + v2 tests。
- branch QA workflow `.github/workflows/v2-qa.yml`。

## Model coverage

1. Security objective / scope。
2. Vulnerability context / prioritization evidence。
3. Authorization enforcement timing。
4. Interpretation-context controls。
5. Blast radius / privilege / segmentation。
6. Encryption threat location / secret revocation / artifact verification。
7. Scanner / test / runtime evidence coverage。
8. Containment / trusted recovery。

所有 model 都是 deterministic synthetic teaching models，不模擬真實 exploit success probability。

## Known implementation limitations before browser QA

目前第一版是 mechanism-linked workbench shell，尚未宣稱 Human Learning Review ready：
- graph 以 state cards 呈現，animation propagation 還需要 browser QA 後再 polish；
- Unit 7 使用 Semgrep-like deterministic model，不執行真實 scanner；
- Final Integrated Transfer 尚未實作成獨立 route；
- progressive terminology reveal 尚未完全 stage 化；
- before/after snapshot UI 尚未完成；
- browser keyboard/focus/direct-route QA 尚未執行。

## Technical QA blocker

目前可用的 container runtime 無法解析 github.com，因此不能 clone branch 執行本地 pnpm QA。

已新增 branch workflow `v2-qa.yml`，但 GitHub Actions 尚未回報 branch workflow run；既有 Pages workflow 只監聽 main。依既定 gate，不因靜態 inspection 宣告 Technical QA PASS，也不 merge main。

## Required QA before Human Learning Review

1. `pnpm install --frozen-lockfile`
2. `pnpm test`
3. `pnpm build`
4. browser QA：desktop / mobile / keyboard / focus / reduced-motion
5. direct `#/v2` / each unit route / reload / unknown route
6. 每 Unit controls 實際造成可見 consequence
7. implement + verify Final Integrated Transfer
8. before/after / propagation animation review
9. GitHub Pages base-path check

完成以上才可標記 `Ready for Human Learning Review`。
