# Live Chat Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Theme the helpdesk support widget with True North's accessible dark palette through the widget's documented `--support-rag-*` CSS properties.

**Architecture:** Define the full public widget theme contract on `:root` in the server-delivered global stylesheet so it exists before the widget loads. Simplify the helpdesk embed to load only the widget script, removing the unsupported iframe stylesheet and host-internal selectors introduced on `main`.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS custom properties, Vitest

## Global Constraints

- The widget remains mounted only by `app/helpdesk/layout.tsx`.
- Use only the documented `--support-rag-*` presentation variables.
- Do not target the widget iframe or internal `.widget*` and `.support-rag-host*` selectors.
- Do not change widget positioning, dimensions, routing, authentication, identity, safety, or conversation behavior.
- Use `#ff1493` with `#09090b` for approximately 5.47:1 accent contrast.
- Preserve the existing untracked `articles-export/` directory and local dev-server logs.

---

### Task 1: Replace unsupported widget styling with the public theme contract

**Files:**
- Create: `app/helpdesk/support-widget-theme.test.ts`
- Modify: `app/globals.css`
- Modify: `app/helpdesk/SupportWidget.tsx`
- Delete: `public/support-widget.css`

**Interfaces:**
- Consumes: The support widget's documented `--support-rag-*` custom-property API and the existing helpdesk-only `SupportWidget` mount.
- Produces: A static root-level theme and a behaviorally unchanged `<Script>` embed without `data-style-url` or internal selector overrides.

- [ ] **Step 1: Write the failing contract test**

Create `app/helpdesk/support-widget-theme.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const globals = readFileSync(resolve(root, 'app/globals.css'), 'utf8');
const widget = readFileSync(resolve(root, 'app/helpdesk/SupportWidget.tsx'), 'utf8');

const expectedTheme = {
  '--support-rag-accent': '#ff1493',
  '--support-rag-accent-contrast': '#09090b',
  '--support-rag-surface': '#101013',
  '--support-rag-canvas': '#070709',
  '--support-rag-text': '#ffffff',
  '--support-rag-muted-text': '#b9b9c2',
  '--support-rag-border': '#3a3a42',
  '--support-rag-danger': '#ff7a7a',
  '--support-rag-font-family':
    'Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif',
  '--support-rag-font-size': '14px',
  '--support-rag-radius': '14px',
  '--support-rag-message-radius': '14px',
  '--support-rag-input-radius': '999px',
  '--support-rag-panel-shadow': '0 30px 80px rgb(0 0 0 / 48%)',
  '--support-rag-header-padding': '16px 18px',
  '--support-rag-content-padding': '18px 16px 24px',
  '--support-rag-message-gap': '14px',
  '--support-rag-message-padding': '10px 12px',
  '--support-rag-composer-padding': '10px 12px 12px',
};

describe('support widget theme', () => {
  it('defines every documented True North theme property on the host root', () => {
    for (const [property, value] of Object.entries(expectedTheme)) {
      expect(globals).toContain(`${property}: ${value};`);
    }
  });

  it('does not inject an iframe stylesheet or target widget internals', () => {
    expect(widget).not.toContain('data-style-url');
    expect(widget).not.toContain('support-rag-host');
    expect(widget).not.toContain('useEffect');
    expect(existsSync(resolve(root, 'public/support-widget.css'))).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
npx vitest run app/helpdesk/support-widget-theme.test.ts
```

Expected: FAIL because the `--support-rag-*` properties are absent, `SupportWidget.tsx` still contains `data-style-url`, and `public/support-widget.css` still exists.

- [ ] **Step 3: Add the static True North theme**

Insert this block at the top of `app/globals.css`, before the universal selector:

```css
:root {
    --support-rag-accent: #ff1493;
    --support-rag-accent-contrast: #09090b;
    --support-rag-surface: #101013;
    --support-rag-canvas: #070709;
    --support-rag-text: #ffffff;
    --support-rag-muted-text: #b9b9c2;
    --support-rag-border: #3a3a42;
    --support-rag-danger: #ff7a7a;
    --support-rag-font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --support-rag-font-size: 14px;
    --support-rag-radius: 14px;
    --support-rag-message-radius: 14px;
    --support-rag-input-radius: 999px;
    --support-rag-panel-shadow: 0 30px 80px rgb(0 0 0 / 48%);
    --support-rag-header-padding: 16px 18px;
    --support-rag-content-padding: 18px 16px 24px;
    --support-rag-message-gap: 14px;
    --support-rag-message-padding: 10px 12px;
    --support-rag-composer-padding: 10px 12px 12px;
}
```

- [ ] **Step 4: Simplify the embed to the supported integration**

Replace `app/helpdesk/SupportWidget.tsx` with:

```tsx
'use client';

import Script from 'next/script';

export function SupportWidget() {
  return (
    <Script
      id="true-north-support-widget"
      strategy="afterInteractive"
      src="https://support.elkayal.me/widget/widget.js"
      data-project="true-north"
      data-base-url="https://support.elkayal.me"
      data-label="Need help?"
      data-title="True North support chat"
      data-position="right"
    />
  );
}
```

Delete `public/support-widget.css`.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npx vitest run app/helpdesk/support-widget-theme.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 6: Run project verification**

Run:

```bash
npm test
npm run build
```

Expected: the full Vitest suite passes and the Next.js production build exits successfully.

- [ ] **Step 7: Verify the live widget in the Codex browser**

Reload `http://localhost:3000/helpdesk`, confirm the helpdesk layout is unchanged, confirm the “Need help?” launcher uses the pink True North treatment, open it, and inspect the dark panel at the normal viewport. Then set a 390px-wide viewport, confirm the widget remains usable without horizontal overflow, and restore the browser's default viewport.

- [ ] **Step 8: Commit the implementation**

```bash
git add app/globals.css app/helpdesk/SupportWidget.tsx app/helpdesk/support-widget-theme.test.ts public/support-widget.css docs/superpowers/plans/2026-07-20-live-chat-theme.md
git commit -m "Style support widget with True North theme"
```

