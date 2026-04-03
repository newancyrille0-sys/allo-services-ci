# Design System Document: The Ivory Horizon

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Concierge"**

This design system moves away from the "utility-only" aesthetic of standard marketplaces. Instead, it adopts a high-end editorial approach tailored for the Ivorian market—combining the prestige of a premium boutique with the unwavering trust of a modern financial institution. 

We break the "template" look through **Intentional Asymmetry** and **Tonal Depth**. By overlapping elements and utilizing a sophisticated scale of transparency, we create a UI that feels like a curated experience rather than a database. The interface shouldn't just "work"; it should feel like a premium service in itself.

---

## 2. Colors: Depth & Trust
Our palette centers on deep, authoritative teals and blues, punctuated by vibrant, meaningful accents.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   **Application:** A section using `surface-container-low` (#f1f4f5) sitting directly on a `background` (#f7fafb) creates a soft, sophisticated transition that feels architectural rather than "boxed in."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface` (#f7fafb)
*   **Structural Sections:** `surface-container-low` (#f1f4f5) or `surface-container` (#ebeeef).
*   **Active Elements:** `surface-container-highest` (#e0e3e4) for high-impact cards.
*   **Nesting:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` section to create a soft, natural lift without requiring a shadow.

### The "Glass & Gradient" Rule
To achieve the premium "Allo Services" feel, use **Glassmorphism** for floating elements (Navigation bars, Action sheets).
*   **Formula:** `surface-container-lowest` at 70% opacity + `backdrop-blur: 20px`.
*   **Signature Textures:** Use a subtle linear gradient from `primary` (#004150) to `primary-container` (#005a6e) for hero backgrounds and main CTAs. This adds a "soul" to the color that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** This font conveys modern tech authority. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create an "Editorial" impact.
*   **Body & Titles (Inter):** Chosen for its exceptional legibility on mobile screens. `body-md` (0.875rem) is the workhorse for service descriptions.
*   **The Trust Factor:** Use `label-md` in `on-surface-variant` (#3f484c) for metadata. The high contrast between `headline-sm` and `body-sm` ensures a clear hierarchy that feels organized and secure.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. We use **Tonal Layering** to define space.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a "natural lift."
*   **Ambient Shadows:** When a floating effect is required (e.g., a "Book Now" sticky button), use a shadow tinted with `on-surface` (#181c1d) at 4% opacity with a blur radius of 40px. This mimics soft, Ivory Coast sunlight rather than harsh artificial light.
*   **The "Ghost Border":** If a separator is required for accessibility, use the `outline-variant` (#bfc8cc) token at **15% opacity**. Never use 100% opaque lines.
*   **3D Depth Effects:** For service cards, use a very subtle inner-glow (1px white stroke at 20% opacity on the top edge) to simulate a beveled glass edge.

---

## 5. Components: Refined Interaction

### Buttons (The Interaction Points)
*   **Primary:** Gradient of `primary` to `primary-container`. `xl` roundedness (1.5rem) for a friendly, modern feel. No border.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. Use for secondary actions like "View Portfolio."
*   **Tertiary:** Transparent background with `primary` text. Use for "Cancel" or "Back."

### Cards (Service Providers)
*   **Construction:** `surface-container-lowest` background. 
*   **Rule:** No dividers. Separate the provider's name from their rating using vertical white space (`spacing-4` / 1rem). 
*   **Status Indicators:** Use `tertiary` (#00460e) for "Verified" badges and `secondary` (#9c4400) for "Urgent" or "Featured" tags.

### Input Fields (Trust & Security)
*   **Style:** `surface-container-low` background with a `ghost border` on focus.
*   **Focus State:** Transition the background to `surface-container-lowest` and apply a subtle glow using `primary_fixed_dim` (#8ed0e7).

### Signature Component: The "Glass Bottom-Nav"
For mobile-first optimization, use a fixed bottom navigation bar with a `backdrop-blur` (32px) and a `surface-container-lowest` at 60% opacity. This keeps the service content visible as the user scrolls, creating a sense of infinite depth.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace (`spacing-12` and `spacing-16`) to separate major service categories.
*   **DO** use fluid animations (e.g., cards that subtly scale 2% on hover) to provide tactile feedback.
*   **DO** leverage the `secondary` orange accent sparingly for high-conversion CTAs.

### Don't
*   **DON'T** use black (#000000) for text. Always use `on-surface` (#181c1d) to maintain a soft, premium look.
*   **DON'T** use 1px solid dividers to separate list items. Use a background color shift or a `1.5rem` vertical gap.
*   **DON'T** apply glassmorphism to everything. Reserve it for floating elements to maintain its "special" feel.

---

## 7. Spacing & Rhythm
Consistency is the key to trust.
*   **Outer Page Padding:** Mobile: `spacing-4` (1rem) | Desktop: `spacing-10` (2.5rem).
*   **Component Internal Padding:** Use `spacing-6` (1.5rem) for cards to allow the content to "breathe," signaling a high-end experience.