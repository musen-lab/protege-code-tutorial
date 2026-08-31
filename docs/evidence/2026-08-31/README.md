# Improvement round 1 visual evidence

The `before` captures come from tutorial commit `d24f8c2`. The `after`
captures come from the completed 2026-08-31 work-order implementation. All
pages were served by a fresh production build, not development mode.

## Matched captures

| Page | Desktop, 1440 by 1000 | iPhone 12 WebKit |
| --- | --- | --- |
| Lesson 1 | [before](before/desktop-lesson-1.png), [after](after/desktop-lesson-1.png) | [before](before/mobile-lesson-1.png), [after](after/mobile-lesson-1.png) |
| Lesson 2 | [before](before/desktop-lesson-2.png), [after](after/desktop-lesson-2.png) | [before](before/mobile-lesson-2.png), [after](after/mobile-lesson-2.png) |
| Lesson 3 | [before](before/desktop-lesson-3.png), [after](after/desktop-lesson-3.png) | [before](before/mobile-lesson-3.png), [after](after/mobile-lesson-3.png) |

The matched captures verify the problem-first lesson openings, collapsed
foundation treatment, existing navigation, typography, and mobile stacking at
the same viewport conditions. Mobile files are top-of-page crops from full
iPhone 12 WebKit captures so the committed evidence remains reviewable.

## New quiz surface

- [Desktop Lesson 1 diagnostic, first answer revealed](after/desktop-lesson-1-quiz.png)
- [Mobile Lesson 4 diagnostic, first answer revealed](after/mobile-lesson-4-quiz.png)

These supplementary captures verify the new surface that has no pre-change
equivalent: concealed answers, native expand controls, source links, markers,
long Java-name wrapping, and one-column mobile behavior.
