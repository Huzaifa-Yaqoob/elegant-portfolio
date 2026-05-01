---
name: Obsidian Edge
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2b2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#cac6c3'
  on-tertiary: '#32302f'
  tertiary-container: '#0b0a09'
  on-tertiary-container: '#7c7977'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  h1:
    fontFamily: Oxanium
    fontSize: 84px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  h2:
    fontFamily: Oxanium
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  h3:
    fontFamily: Oxanium
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: '0'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0.01em'
  body-sm:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Oxanium
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.12em
  label-data:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: '0'
spacing:
  unit: 8px
  gutter: 24px
  margin-page: 64px
  section-gap: 160px
  diagonal-offset: 12vw
---

## Brand & Style
The design system is anchored in a high-contrast, "Dark Mode First" philosophy. The visual style blends **Minimalism** with **Brutalism**, utilizing heavy whitespace and diagonal layouts to suggest motion and high-end technical precision.

## Colors
- **Primary (#0A0A0A):** The Deep Obsidian base.
- **Secondary (#F5F5F5):** Smoky Off-white for typography and hero elements.
- **Accents:** Mid-range grays used for borders to maintain a raw, structural look.
- **Interaction:** Hover states invert colors to create a high-energy "flash" effect.

## Typography
The system uses a pairing of technical geometry and modern grotesque accessibility.

- **Headlines:** Use **Oxanium**. Its faceted, sci-fi inspired cuts reinforce the "Obsidian Edge" name. Used in heavy weights with tight tracking for an aggressive, architectural presence.
- **Body:** Use **Outfit**. Its circular nature and high legibility provide a friendly yet professional contrast to the sharp headlines, ensuring long-form content is easy to digest.
- **Metadata & Labels:** Use **Oxanium** for all-caps labels to lean into the technical aesthetic, while using **Outfit** for dense data points to ensure clarity.

## Layout & Spacing
- **The Diagonal:** Sections are separated by -3 to -5 degree skews. Content is counter-skewed to maintain vertical alignment.
- **Rhythm:** Large vertical gaps (160px+) ensure the high-contrast elements feel intentional and premium.
- **Alignment:** Asymmetric balance—left-hung Oxanium headlines versus right-aligned Outfit metadata.

## Elevation & Depth
- **Surfaces:** Depth is achieved through tonal layering (using `#121212`) rather than soft shadows.
- **Borders:** 1px solid lines in `#333333` define boundaries, leaning into a blueprint/wireframe aesthetic.
- **Layering:** Elements overlap; an Oxanium tag might "pierce" the border of an image container.

## Shapes
- **Zero Radius:** All corners are strictly 0px. The sharp geometry complements the angular cuts of the Oxanium typeface.

## Components
- **Buttons:** Rectangular, 2px border. Hover inverts from Outline to Solid.
- **Chips:** Small Oxanium labels in a 1px frame for tech stacks.
- **Cards:** Defined by 1px borders; no elevation until hover, which triggers a subtle fill (#1A1A1A).
- **Input Fields:** Bottom-border only. On focus, the Outfit label slides up and transitions to Oxanium for a "system-active" feel.