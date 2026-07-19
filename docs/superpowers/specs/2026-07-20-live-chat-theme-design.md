# Live Chat Theme Design

## Goal

Style the externally embedded support widget so it feels native to True North's helpdesk while using only the widget's documented `--support-rag-*` CSS custom properties.

## Scope

- Define the widget theme in the host application's global stylesheet.
- Theme the launcher, panel, transcript, messages, composer, inputs, cards, and error states through the public variables.
- Do not change the widget embed, position, dimensions, routing, authentication, behavior, markup, or iframe contents.
- Do not add route-specific JavaScript. The variables are inert on pages where the widget is not embedded.

## Visual Direction

The widget will use the helpdesk's restrained dark presentation:

- A deep berry tint (`#4a1536`) inspired by the helpdesk tags for the launcher, header, visitor messages, and primary actions.
- Soft pink (`#ff9bd2`) over the berry accent, keeping bright pink to text and smaller details instead of large surfaces.
- Near-black panel and composer surfaces (`#101013`) over a deeper transcript canvas (`#070709`).
- White primary text, cool-gray secondary text, subtle neutral borders, and an accessible coral error color.
- Inter typography at a compact 14px base size.
- Rounded panels and message bubbles with pill-shaped inputs and actions.
- A deep neutral panel shadow without decorative gradients or glow.

## Implementation

Add the complete supported variable set to `:root` near the start of `app/globals.css`. Static stylesheet delivery makes the theme available before the external widget loads and prevents a flash of its default presentation.

No widget internals or iframe selectors will be targeted. No unsupported custom properties will be introduced.

## Accessibility

- Use `#ff9bd2` over `#4a1536` for an accent contrast ratio of approximately 7.49:1.
- Use white and `#b9b9c2` on `#101013` for primary and muted text contrast above 4.5:1.
- Keep borders distinguishable from both dark surfaces.
- Leave focus, forced-colors, reduced-motion, zoom, and responsive behavior to the widget's supported implementation rather than overriding internals.

## Verification

- Add a focused source-level test that checks the documented variable set and approved values in `app/globals.css`.
- Run that test first and confirm it fails before adding the variables.
- Run the full test suite and production build after implementation.
- Open `/helpdesk` in the Codex browser and visually confirm the existing page remains unchanged; if the external widget is active in the local environment, inspect its launcher and open panel at desktop and narrow viewport widths.

