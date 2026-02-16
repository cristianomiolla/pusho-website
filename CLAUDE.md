# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pusho website is a marketing/landing site for the Pusho fitness app - an AI-powered push-up counter. Built with Astro 5 as a static site, deployed to pusho.it.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
```

## Architecture

### Framework
- **Astro 5** with static output mode
- TypeScript with path alias `@/*` mapping to `src/*`

### File Structure
- `src/layouts/Layout.astro` - Main layout with navbar, footer, global styles, and TikTok Pixel integration
- `src/pages/` - Page components (index, support, privacy, terms)
- `public/` - Static assets including images, brand elements, and i18n files

### Internationalization
The site supports Italian (default) and English via a custom client-side i18n system:
- Translation files: `public/i18n/{it,en}.json`
- Script: `public/i18n.js` - handles language detection, switching, and storage
- Elements use `data-i18n="key.path"` attribute for text content
- Language preference stored in localStorage under `pusho-lang`
- Mockup images swap based on language via `data-mockup-it` and `data-mockup-en` attributes

### Styling
- CSS custom properties defined in Layout.astro (brand colors, typography, spacing)
- Fonts: Agdasima (headings), Inter (body) via Google Fonts
- Mobile-responsive with breakpoints at 768px and 1024px

### Analytics
TikTok Pixel integrated in Layout.astro for tracking page views and button clicks (ClickButton, CompletePayment events).
