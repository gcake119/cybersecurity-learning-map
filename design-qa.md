# Light technical learning map — design QA

final result: passed

## Visual evidence and state
- Source: approved light variant, `../generated_images/exec-1b58c24e-f99c-4bc3-b227-1069706b4e51.png` (1487 × 1058).
- Browser: Chrome via the supported cloud browser; local Vue preview at http://terminal.local:4173/cybersecurity-learning-map/#/slide/6.
- Initial capture: `/workspace/scratch/cybersecurity-light-preview.jpg`.
- Revised desktop: `/workspace/scratch/cybersecurity-light-final.jpg`; map: `/workspace/scratch/cybersecurity-map.jpg`; responsive: `/workspace/scratch/cybersecurity-mobile.jpg`.
- Desktop CSS viewport 1363 × 936, devicePixelRatio 1. Screenshots use native pixels, no density conversion. Source has a slightly wider/taller frame. Compared content regions rather than claiming pixel-exact equality. Final desktop capture is scrolled past the 78px header to show the complete chapter controls; initial capture covers header and title.
- Mobile checked in a 390px-wide browser iframe; its surrounding gray QA harness is excluded from the design judgment. This checks narrow CSS layout, not physical-device emulation.
- State: HTTP lesson, Request selected, identity explanation, progress unchecked. Response, playback and permission states also exercised.
- Source and revised captures were returned together in the same comparison input. Main diagram, inspector text, and footer were readable at full view; focused inspection checked server labels against the artwork and mobile card labels.

## Comparison history
1. P2: Initial desktop whitespace and inspector spacing pushed navigation below the main viewport. Reduced diagram minimum height from 470px to 360px, tightened inspector code/metadata spacing, and allowed long chapter labels to wrap. Revised capture shows navigation and completion controls clearly.
2. P2: Server title overlapped the equipment vents. Moved HTML labels and check buttons down into the panel area, with separate mobile positioning. Revised capture shows the title and controls separated.

## Required fidelity surfaces
- Typography: navy, bold Traditional Chinese heading, restrained system sans-serif fallback and monospace packet data retain the reference hierarchy. HTML copy is selectable and readable; the generated reference does not identify a reproducible font family.
- Layout: retained header mode switch, two-column lesson/inspector composition, large laptop/server, dual flow lines, practice strip and nine-stop chapter track. Mobile stacks the inspector below the interactive diagram.
- Tokens: cool white/pale blue surfaces, navy text, cyan request and amber response; consistent borders and focus outlines across map and slides.
- Images: generated silver/blue laptop and server artwork integrated as optimized WebP, no illustrated asset replaced by a CSS drawing. Phosphor library supplies standard UI icons. Image details differ slightly from the concept image, but subject, lighting and material direction are preserved.
- Content: all 16 existing educational slides retained; HTTP sample remains explicitly illustrative. Real buttons reveal Request/Response, identity/permission/data explanations, playback and practice content.

## Verification
- Vue TypeScript production build passed.
- Cloud browser verified Request/Response switching, permission explanation, timed packet playback, map-to-slide navigation, completion toggling and persistence across reload.
- Console checked: no application-origin errors observed; unrelated browser-extension metadata errors were excluded.
- Responsive browser preview checked at 390px width. CI browser suite covers all 16 slides at desktop and mobile widths, routing, keyboard controls and progress edge cases.

## Acceptable deviations / P3
- Omitted faint decorative grid and code line numbers; used straight functional packet tracks instead of the reference's decorative bends.
- Added explicit playback and explanation controls, previous-page navigation, and a separate progress/reset row.
- Map chapters use a consistent library icon system; only the HTTP lesson uses the two large raster illustrations.
- Shorter screens scroll vertically; controls stay in normal document flow.

## Implementation checklist
- [x] Match approved light technical palette and illustrated subjects.
- [x] Fix diagram labels and desktop density.
- [x] Preserve Vue, pnpm and GitHub Pages routing.
- [x] Inspect browser rendering and primary interactions.
- [x] Update browser regression suite for new lesson markup.

## Deployment verification
GitHub Actions run 35011017403 passed build, the full browser suite and Pages deployment for commit b129501e679873c11f6fd66620f59441e5d156f9.
