# AgentPlaces Design System & Style Guide

## Overview
The AgentPlaces design system is inspired by modern corporate platforms like Framer, Notion, and Atlassian, featuring a clean, professional, and scalable visual language that enhances user experience and productivity.

## 🎨 Color Palette

### Primary Colors
- **Primary Red**: `#D6232C` (Pantone 2205 C) - Brand primary, CTAs, alerts
- **Primary Light**: `#E04851` - Hover states, lighter accents
- **Primary Dark**: `#B01E26` - Active states, pressed buttons

### Secondary Colors
- **Secondary Brown**: `#B28B67` (Pantone 17-1230 "Mocha Mousse") - Secondary actions, warm accents
- **Secondary Light**: `#C4A084` - Background tints, subtle highlights
- **Secondary Dark**: `#9A7A5A` - Text accents, darker variants

### Accent Colors
- **Accent Green**: `#88B04B` (Pantone 15-0343 "GREENERY") - Success states, positive actions
- **Accent Light**: `#9BC062` - Success backgrounds, light success states
- **Accent Dark**: `#739B3F` - Success text, dark success variants

### Neutral Colors
- **White**: `#FFFFFF` - Primary background, cards, overlays
- **Light**: `#F5F5F5` - Secondary backgrounds, subtle sections
- **Gray**: `#E0E0E0` - Borders, dividers, input borders
- **Medium**: `#9E9E9E` - Secondary text, placeholders, disabled states
- **Dark**: `#666666` - Secondary headings, body text
- **Charcoal**: `#333333` - Primary text, headings, high contrast

## 📝 Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Fallback**: System fonts for optimal performance

### Font Weights
- **Regular**: 400 - Body text, labels
- **Medium**: 500 - Buttons, form labels
- **Semibold**: 600 - Subheadings, important text
- **Bold**: 700 - Headings, emphasis

### Font Sizes & Usage
- **12px (xs)**: Small labels, captions, metadata
- **14px (sm)**: Body text, input text, secondary information
- **16px (base)**: Primary body text, default size
- **18px (lg)**: Large body text, introductory text
- **20px (xl)**: Small headings, section titles
- **24px (2xl)**: Medium headings, card titles
- **30px (3xl)**: Large headings, page titles
- **36px (4xl)**: Hero headings, section headers
- **48px (5xl)**: Display headings, marketing content

### Line Heights
- **Tight (1.25)**: Headings, display text
- **Normal (1.5)**: Body text, paragraphs
- **Relaxed (1.625)**: Long-form content, descriptions

## 📏 Spacing Scale

Based on 8px grid system for consistency and rhythm:

- **4px (space-1)**: Icon padding, micro spacing
- **8px (space-2)**: Element gaps, small padding
- **12px (space-3)**: Button padding, small margins
- **16px (space-4)**: Standard padding, element spacing
- **20px (space-5)**: Medium spacing, component gaps
- **24px (space-6)**: Large padding, section spacing
- **32px (space-8)**: Component separation, card padding
- **40px (space-10)**: Large margins, content spacing
- **48px (space-12)**: Section padding, major spacing
- **64px (space-16)**: Large section gaps, hero spacing
- **80px (space-20)**: Major section padding
- **96px (space-24)**: Extra large spacing, page sections

## 🔘 Border Radius

Progressive radius scale for modern, soft design:

- **2px (sm)**: Small elements, badges
- **6px (md)**: Buttons, inputs, small cards
- **8px (lg)**: Cards, modal dialogs
- **12px (xl)**: Large cards, feature boxes
- **16px (2xl)**: Hero cards, prominent elements
- **24px (3xl)**: Extra large cards, main containers
- **9999px (full)**: Circular elements, pills

## 🎭 Shadows

Layered shadow system for depth and hierarchy:

- **Small**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- **Medium**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` - Cards, buttons
- **Large**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` - Dropdowns, modals
- **Extra Large**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` - Hero elements

## ⚡ Transitions

Consistent timing for smooth interactions:

- **Fast (150ms)**: Micro-interactions, hovers
- **Normal (250ms)**: Standard transitions, state changes
- **Slow (350ms)**: Complex animations, page transitions

## 🎯 Component Usage Guidelines

### Buttons
- **Primary**: Main actions, CTAs, form submissions
- **Secondary**: Alternative actions, secondary CTAs
- **Accent**: Success actions, positive confirmations
- **Outline**: Subtle actions, cancel buttons
- **Ghost**: Text-only actions, minimal emphasis

### Cards
- Use consistent padding: `space-6` to `space-8`
- Apply subtle borders and shadows for depth
- Include gradient accents for visual hierarchy
- Implement hover states for interactive cards

### Navigation
- Sticky positioning for persistent access
- Clear active states with gradients
- Smooth transitions between states
- Responsive collapsing for mobile

### Forms
- Consistent spacing with `space-4` gaps
- Clear focus states with primary color outline
- Error states with primary (red) color system
- Success states with accent (green) color system

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

### Container Constraints
- **Max Width**: 1200px for content readability
- **Padding**: Responsive from `space-4` to `space-8`
- **Grid Systems**: CSS Grid and Flexbox for layouts

## ♿ Accessibility

### Color Contrast
- **Text on White**: Minimum 4.5:1 ratio
- **Interactive Elements**: Clear focus indicators
- **Status Colors**: Not relying solely on color for meaning

### Focus Management
- **Visible Focus**: 2px primary color outline
- **Tab Order**: Logical keyboard navigation
- **Screen Readers**: Semantic HTML and ARIA labels

### Motion Preferences
- **Reduced Motion**: Respect `prefers-reduced-motion`
- **Essential Animation**: Only for feedback and orientation

## 🔧 Implementation

### CSS Custom Properties
All design tokens are available as CSS custom properties:
```css
/* Usage Examples */
.my-component {
  color: var(--primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}
```

### Component Classes
Pre-built component classes following BEM methodology:
```css
/* Button Examples */
.btn.btn-primary.btn-lg
.btn.btn-secondary.btn-sm
.btn.btn-outline

/* Card Examples */
.card.card-elevated
.feature-card
.stat-item
```

## 🎨 Design Inspiration Sources

### Framer
- **Gradients**: Subtle background gradients for depth
- **Animation**: Smooth, purposeful micro-interactions
- **Typography**: Bold headings with gradient text effects

### Notion
- **Layout**: Clean, organized content structure
- **Spacing**: Generous whitespace for readability
- **Navigation**: Intuitive, always-accessible navigation

### Atlassian
- **Color System**: Professional, accessible color palette
- **Components**: Consistent, reusable UI components
- **Information Architecture**: Clear hierarchy and organization

This design system ensures consistency, scalability, and an exceptional user experience across the AgentPlaces platform.
