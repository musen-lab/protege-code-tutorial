# Round 1 follow-up visual evidence

Compared tutorial baseline `c7fe1b7` with the R-1 through R-5 follow-up
working tree. Both revisions were served from fresh production builds.

## Capture method

- Desktop: headless Google Chrome, 1440 by 1000 CSS pixels.
- Mobile: Playwright WebKit with the iPhone 12 device profile, 390 by 664 CSS
  pixels at a 3x device scale.
- Page: `/lessons/startup`.
- State: no saved progress; foundation and diagnostic details left closed.

## Before / after

| Changed aspect | Before | After |
| --- | --- | --- |
| R-1, `config.xml` | The section explained the five blocks in prose, a diagram, and a table, but showed no XML. [Desktop](before/desktop-lesson-2-start-levels.png), [mobile](before/mobile-lesson-2-start-levels.png) | A source cutaway now shows boot delegation, a complete named early block, and the final directory-only plugin block. [Desktop](after/desktop-lesson-2-start-levels.png), [mobile](after/mobile-lesson-2-start-levels.png) |
| R-3, duration label | Lesson 2 showed the pre-round `30 min` estimate. [Desktop](before/desktop-lesson-2-duration.png), [mobile](before/mobile-lesson-2-duration.png) | Lesson 2 separates its revised core estimate from the skippable foundation track as `55 min + 10 min optional`. [Desktop](after/desktop-lesson-2-duration.png), [mobile](after/mobile-lesson-2-duration.png) |
| R-5, page navigation | The OSGi foundation link looked identical to required core sections. [Desktop](before/desktop-lesson-2-nav.png) | The same link carries a muted, visible `optional` tag. [Desktop](after/desktop-lesson-2-nav.png) |

The page navigation is intentionally hidden below 760 pixels, so R-5 has no
mobile pair. This is existing responsive behavior rather than missing evidence.

Focused R-1 after captures make the XML legible at review size:
[desktop](after/desktop-config-cutaway.png) and
[mobile](after/mobile-config-cutaway.png).

## Duration estimation record

No formula was recorded with the original duration strings. The refresh keeps
each original label as the baseline for its original content, allows 1.25
minutes for each delayed diagnostic question, adds five-minute blocks for
substantial new core teaching artifacts, and rounds upward to five minutes.
Foundation tracks are estimated separately and excluded from the main number.

| Lesson | Calculation | Label |
| --- | --- | --- |
| 1 | 25 original + 7.5 diagnostics + 5 new core artifact | `40 min` |
| 2 | 30 original + 11.25 diagnostics + 10 new core artifacts | `55 min + 10 min optional` |
| 3 | 40 original + 17.5 diagnostics | `60 min + 10 min optional` |
| 4 | 35 original + 11.25 diagnostics | `50 min` |

## Manual verification

1. Run `npm run build && npm run start -- --port 3101`.
2. Open `http://127.0.0.1:3101/lessons/startup`.
3. Confirm the OSGi foundation entry under **On this page** is tagged optional.
4. Scroll to **Start order is application architecture** and compare the XML
   cutaway with the linked pinned `config.xml` lines.
5. Confirm the lesson header and course map display the revised duration
   without clipping or displacing navigation.
