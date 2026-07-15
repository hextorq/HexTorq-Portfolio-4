# HexTorq Portfolio 4

Production portfolio template for HexTorq.

Live site: https://portfolio-4.hextorq.tech/

## Website Overview

HexTorq Portfolio 4 is the default production-facing template. It keeps the premium dark technology style while giving more structure to product showcases, service explanations, process storytelling, and footer navigation.

This version is the strongest default for a public company website because it balances visual impact with practical business information.

## Page Flow

- Home: HexTorq hero and company positioning.
- About: company story and delivery mindset.
- Services: software, websites, apps, ERP, billing, and custom builds.
- Products: PayPanda, PrintPanda, TicketsPanda, and related product ecosystem content.
- Projects: academic, IoT, and custom engineering work.
- Process: eight-stage delivery workflow.
- Contact: direct final call to start a project.
- Footer: product, resource, company, and legal navigation.

## UI Direction

- Mature dark technology-company layout.
- Strong HEXTORQ first-viewport branding.
- Scroll reveal animations across the page.
- Product cards that make the Panda suite feel like a connected ecosystem.
- Larger footer structure for a finished company-site feel.
- Small template-switch control for moving to another HexTorq portfolio style while keeping the same route.

## Static Build And SEO

The project uses Vite with a prerender step. Running the build generates static HTML route folders in `dist/`, so deployed pages can be served directly as HTML, CSS, and JavaScript.

```bash
npm install
npm run build
```

The generated output includes prerendered pages such as `/about/`, `/services/`, `/products/`, `/projects/`, `/process/`, and `/contact/`.

## Deployment Notes

This site is intended for Vercel static deployment. The included `vercel.json` allows cross-origin asset loading and iframe embedding from HexTorq domains so the portfolio mix website can preload and display this template.

## Content Editing

Most public-facing content is in `src/content.js`. Update that file for company description, stats, product descriptions, process steps, social links, footer links, and contact details.
