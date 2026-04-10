# Design System Strategy: Architectural Precision

## 1. Overview & Creative North Star
The design system for **ALLO SERVICES CI** is defined by the Creative North Star: **"The Sovereign Ledger."** 

This is not a generic administrative interface; it is a high-end command center. We move away from the "bootstrap" aesthetic by embracing **Architectural Precision**—a methodology that relies on spatial intent, tonal depth, and editorial typography rather than structural lines. The goal is to convey an atmosphere of absolute reliability and data-driven authority. By utilizing intentional asymmetry and "stacked" surface layers, we create a digital environment that feels curated, professional, and efficient.

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is anchored in deep oceanic blues and sophisticated slate grays, punctuated by high-chroma functional accents.

*   **Primary (`#001e40`) & Primary Container (`#003366`):** These are your "Foundation" colors. Use them to establish the most important brand touchpoints.
*   **Tertiary & Success (`#00b27b`):** This is your "Vibrant Growth" accent. Use it sparingly for success states to ensure it retains its visual impact.
*   **The "No-Line" Rule:** To achieve a premium editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries between content areas must be defined solely through background color shifts. 
    *   *Example:* A `surface-container-lowest` card should sit atop a `surface-container-low` section. The change in hex code provides the edge, not a stroke.
*   **The Glass & Gradient Rule:** For floating navigation or top-level headers, use semi-transparent `surface` colors with a 20px backdrop-blur. To add "soul" to the data, use subtle linear gradients (e.g., `primary` to `primary_container`) on primary CTAs and active state indicators.

## 3. Typography: Editorial Authority
We use a dual-typeface system to balance character with functionality.

*   **Display & Headlines (Manrope):** Use Manrope for all `display-` and `headline-` tokens. Its geometric construction feels modern and high-end. Use tight letter-spacing (-2%) for headlines to create a "locked-in" editorial look.
*   **Body & Titles (Inter):** Use Inter for all `title-`, `body-`, and `label-` tokens. Inter is optimized for the data-dense requirements of an admin dashboard, ensuring maximum legibility at small sizes.
*   **Hierarchy Note:** Use high contrast in scale. A `display-md` page title next to a `body-sm` timestamp creates a sophisticated, intentional hierarchy that guides the eye.

## 4. Elevation & Depth: Tonal Layering
In this design system, depth is a product of light and material, not structure.

*   **The Layering Principle:** Stacking surface tiers is the primary method of organization.
    *   **Level 0 (Background):** `surface` (#f7f9fb)
    *   **Level 1 (Sectioning):** `surface-container-low` (#f2f4f6)
    *   **Level 2 (Cards/Content):** `surface-container-lowest` (#ffffff)
*   **Ambient Shadows:** When an element must "float" (like a dropdown or modal), use an ultra-diffused shadow. 
    *   *Shadow Spec:* `0px 12px 32px rgba(25, 28, 30, 0.06)`. The shadow is a tinted version of the `on-surface` color, creating a natural, atmospheric lift.
*   **The Ghost Border Fallback:** If containment is functionally required (e.g., in complex form groups), use a "Ghost Border": `outline-variant` at 15% opacity. Never use 100% opaque borders.

## 5. Components: Refined Primitives

*   **Cards:** Cards must use `surface-container-lowest` with a border-radius of `xl` (0.75rem). No borders. Use vertical white space (32px+) to separate internal content rather than dividers.
*   **Buttons:**
    *   *Primary:* Use a subtle gradient from `primary` to `primary_container`. Border radius: `md` (0.375rem).
    *   *Secondary:* `surface-container-high` background with `on-surface` text. 
*   **Input Fields:** Use the `surface-container-low` for the field background. On focus, transition to a "Ghost Border" using the `surface_tint`. The label should use `label-md` in `on-surface-variant`.
*   **Chips:** Use `secondary_container` for read-only metadata. Use `tertiary_fixed` for success-oriented statuses. Chips should always have a `full` (9999px) radius.
*   **Data Tables (Signature Component):** Forbid the use of vertical and horizontal lines. Use "Zebra Layering" where every second row uses `surface-container-low`. The header row must use `title-sm` in `primary` with a subtle `surface-variant` background.
*   **Status Indicators:** Use a "Glow" effect—a small 8px circle of `on-tertiary-container` with a 4px blurred shadow of the same color to indicate "Live" or "Active" data.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical padding (e.g., more padding at the top of a card than the bottom) to create a sense of movement.
*   **Do** embrace "White Space as a Utility." If the data feels crowded, increase the surface-container padding rather than adding lines.
*   **Do** use `surface-bright` for hover states on cards to create a "lighting up" effect.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on-surface` or `on-background` to maintain the slate-gray tonal harmony.
*   **Don't** use standard "drop shadows" on every card. Only use shadows for elements that physically sit above the layout (modals, tooltips, floating nav).
*   **Don't** use "Alert Red" for anything other than critical errors. Use `secondary` for neutral states to keep the dashboard feeling calm and reliable.
*   **Don't** use dividers. If you feel the need for a divider, you likely need more `body-lg` spacing instead.