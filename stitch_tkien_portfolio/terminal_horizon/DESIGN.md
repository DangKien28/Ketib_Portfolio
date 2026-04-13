# Design System Strategy: The Kinetic Architect

## 1. Overview & Creative North Star
The "Kinetic Architect" is the creative North Star for this design system. It moves away from the static "template" look of traditional portfolios and instead treats the interface as a living terminal—a high-end, editorialized command center for backend engineering. 

We reject the "flat" web. Instead, we embrace **Functional Depth**. The design breaks traditional grids through intentional asymmetry: code blocks might bleed off the edge of a container, while typography scales jump from massive display headers to tiny, precise terminal labels. This creates a rhythmic tension between "High-Tech Professionalism" and "Raw Engineering Power." We aren't just showing code; we are showcasing the infrastructure of the digital world.

## 2. Colors: The Void and the Pulse
The palette is rooted in the "Void" (`surface-container-lowest`: #000000) and energized by the "Pulse" (`primary`: #84adff).

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate the "Main Console" from the "Sidebar Log," use a background shift from `surface` (#0e0e0e) to `surface-container-low` (#131313). Contrast is achieved through value, not outlines.
*   **Surface Hierarchy & Nesting:** Treat the UI as nested hardware components. 
    *   **Base Layer:** `surface-dim` (#0e0e0e).
    *   **Nested Modules:** Use `surface-container` (#191919) for cards. 
    *   **Active Overlays:** Use `surface-container-highest` (#262626) for dropdowns and popovers.
*   **The "Glass & Gradient" Rule:** To achieve a futuristic "HUD" (Heads-Up Display) feel, floating navigation and terminal headers must use Glassmorphism. Apply `surface` at 70% opacity with a `backdrop-blur` of 12px. 
*   **Signature Textures:** For primary CTAs (e.g., "Hire Me" or "Download CV"), use a subtle linear gradient from `primary` (#84adff) to `primary-dim` (#0070ea) at a 135-degree angle. This adds a "lithium-ion" glow that flat hex codes cannot replicate.

## 3. Typography: Editorial Technicality
We utilize a high-contrast pairing: **Space Grotesk** for structural impact and **Inter** for data density.

*   **Display & Headlines (Space Grotesk):** These are your "Architectural" elements. Use `display-lg` (3.5rem) for hero sections. The wide aperture of Space Grotesk feels engineered and futuristic.
*   **Body & Labels (Inter):** These are your "Functional" elements. Inter provides the legibility required for complex data tables and log files.
*   **The Hierarchy Shift:** Use `label-sm` (0.6875rem) in `on-surface-variant` (#ababab) for metadata and timestamps. The extreme jump from a `headline-lg` to a `label-sm` creates an editorial, high-end feel that signals sophistication.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for a "Deep Black" UI. We use light to define space.

*   **The Layering Principle:** Instead of shadows, use "Inner Glows." A `surface-container-high` card sitting on a `surface` background should have a 1px top-border (the "Ghost Border") using `outline-variant` at 15% opacity to mimic light hitting the edge of a monitor.
*   **Ambient Shadows:** For floating elements like dropdown menus, use a "Cyan-Tinted Shadow." 
    *   *Spec:* `0px 20px 40px rgba(0, 123, 255, 0.08)`. This creates a subtle blue aura rather than a muddy black smudge.
*   **The "Ghost Border" Fallback:** If containment is required for data tables, use the `outline-variant` (#484848) at 20% opacity. It should be barely perceptible—felt rather than seen.

## 5. Components: The Terminal Toolkit

*   **Buttons:**
    *   *Primary:* Gradient fill (Primary to Primary-Dim), `rounded-sm` (0.125rem) for a sharp, aggressive look.
    *   *Secondary:* `surface-container-highest` background with a `primary` text. No border.
*   **Data Tables (The Logic Engine):**
    *   Forbid divider lines. Use `surface-container-low` for even rows and `surface` for odd rows. 
    *   **Status Badges:** Use `tertiary-container` for "Running" (soft purple) and `error-container` for "Failed." Badges should use `label-sm` and have 0% border-radius for a brutalist, technical aesthetic.
*   **Sidebar Log Area:**
    *   Must use `surface-container-lowest` (#000000). 
    *   Text should be `on-surface-variant` with "Success" messages highlighted in `primary`.
*   **Interactive Forms:**
    *   Inputs use `surface-container-highest`. Upon focus, the bottom border "activates" with a `primary` glow. 
    *   Use `rounded-none` for input fields to maintain the "high-tech instrument" vibe.
*   **Navigation Menus:**
    *   Complex dropdowns should use the Glassmorphism rule. Use `spacing-4` (0.9rem) for internal padding to ensure the "breathing room" of high-end design.

## 6. Do's and Don'ts

### Do:
*   **Do** use `primary-fixed-dim` for icons to give them a "powered-on" look.
*   **Do** embrace asymmetry. Align a large headline to the left and a small technical description far to the right.
*   **Do** use the Spacing Scale strictly. `spacing-16` (3.5rem) should be used between major sections to let the "Deep Black" background create a sense of infinite space.

### Don't:
*   **Don't** use pure white (#ffffff) for long paragraphs of text. Use `on-surface-variant` (#ababab) to prevent eye strain against the black background.
*   **Don't** use `rounded-full` for anything other than status indicators. Round corners suggest "consumer-grade" apps; sharp or slightly softened corners (`rounded-sm`) suggest "professional-grade" tools.
*   **Don't** use standard 1px borders to separate content. If you feel the need for a line, use a background color shift instead.