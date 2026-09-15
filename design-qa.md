# Scenario redesign verification

final result: passed

## Current acceptance target
The user rejected renamed presentation cards and approved condition → action → observable consequence → comparison. The nine phase routes now render executable local scenario models, not the old presentation components. Existing cool white/blue design tokens and UI icon family are retained.

## Evidence
- Local implementation: http://terminal.local:4173/cybersecurity-learning-map/#/lab/3 and #/lab/8.
- Browser-rendered HTTP comparison: /workspace/scratch/security-lab-auth.jpg.
- Browser-rendered mobile controls: /workspace/scratch/security-lab-mobile.jpg.
- Desktop viewport: 1363 × 936 CSS pixels, DPR 1. Mobile layout: 390px-wide iframe; gray harness excluded from review.
- Source of functional truth: user's approved scenario table and request to rebuild. The old HTTP illustration mock is a palette reference, not the layout acceptance target for these new experiments.

## Inspected behavior
- Alice requests Bob's case: 200 plus case data without object authorization, 403 plus an empty result table with authorization.
- Changed inputs preserve the old result and display a stale-result prompt until executed again.
- Run snapshots and changed conditions appear in the comparison section. Observing required contrasting outcomes automatically records completion.
- CI simulation: valid-user test alone misses a removed ownership check; the cross-account test detects it and blocks the change.
- Mobile controls stack before output; execute scrolls to the result on narrow screens.
- Browser logs: no application-origin console errors observed.
- Production TypeScript/Vue build passed. A pure-model check passed 22 scenario outcomes and all 9 completion conditions. The deployed workflow additionally runs the nine-scenario browser regression suite before publication.

## Visual and content review
- Typography: existing navy sans-serif hierarchy; readable labels, output headings, code and comparison text.
- Layout: stable condition/result columns, mobile stacking, labeled run button, clearly separated comparison section; no slideshow paging.
- Colors: shared pale blue controls; text plus color distinguishes exposed/protected results, not color alone.
- Images/icons: existing Phosphor UI icons and original generated client/server thumbnails in the HTTP starting state. No new decorative image approximations.
- Content: result explanations reflect model output; enums were replaced by human-readable change descriptions. Every experiment exposes simulation limits and original reference links.

## Findings addressed
- Old content revealed by card clicks was replaced with state-dependent simulation output.
- Removed manual completion; old reading progress is not treated as experimental evidence.
- Removed old presentation components and kept legacy links as redirects.
- Added UI-vs-direct-request behavior so hiding an interface entry is distinguishable from a server refusing access.

## Limits
The models cover the named scenarios, not arbitrary SQL/Shell execution or exhaustive security behavior. Browser evidence covers HTTP and CI flows and narrow-screen controls; CI tests cover all nine models on desktop/mobile plus routing, completion and storage handling. Vertical scrolling is intentional for operation and comparison sections.
