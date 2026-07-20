/**
 * Centralized SEO Metadata & JSON-LD Schemas for Hextorq
 * Optimized for Google Search, Bing, ChatGPT Search, Perplexity, Gemini & Claude.
 */

export const BASE_URL = 'https://hextorq.tech'

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Hextorq',
  legalName: 'Hextorq Tech Solutions',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description:
    'Hextorq is a full-spectrum AI software development company engineering web apps, mobile solutions, enterprise ERPs, and SaaS products.',
  foundingDate: '2024',
  email: 'hello@hextorq.tech',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'India',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@hextorq.tech',
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://twitter.com/hextorq',
    'https://linkedin.com/company/hextorq',
    'https://instagram.com/hextorq',
    'https://youtube.com/@hextorq',
  ],
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Hextorq — AI Software Development Company',
  description: 'Engineering high-performance web apps, mobile apps, SaaS platforms, and custom software.',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: 'en-US',
}

export const SERVICES_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI & Custom Software Development',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: 'Worldwide',
    description:
      'Custom software engineering, AI automation, APIs, and scalable backends built specifically for business needs.',
    name: 'Software Engineering & AI Development',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: 'Worldwide',
    description:
      'Fast, high-converting websites and modern web applications built using React, Next.js, and modern CSS.',
    name: 'Website & Web Application Development',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Mobile App Development',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: 'Worldwide',
    description:
      'Native-feeling iOS and Android mobile applications built using React Native and Flutter.',
    name: 'Mobile App Development',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'ERP & Billing Software Development',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: 'Worldwide',
    description:
      'Unified enterprise resource planning and GST-ready billing software for streamlined business operations.',
    name: 'ERP & Billing Software Solutions',
  },
]

export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Hextorq provide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hextorq specializes in AI software development, custom web and mobile app engineering, enterprise ERP solutions, GST billing software, and SaaS product engineering.',
      },
    },
    {
      '@type': 'Question',
      name: 'What products does Hextorq operate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hextorq operates three live SaaS products: PayPanda (payment gateway), PrintPanda (automated printing platform), and TicketsPanda (event ticketing & access control).',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Hextorq support student and academic projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Through our Innovation Lab, Hextorq guides students and researchers in building real-world IoT prototypes, hardware systems, and documented academic software.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I hire Hextorq for a custom software project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Hextorq directly via email at hello@hextorq.tech or through our contact section to request a consultation and detailed scope estimation.',
      },
    },
  ],
}

export const ROUTE_SEO_MAP = {
  '/': {
    title: 'Hextorq — AI Software Development Company & Tech Solutions',
    description:
      'Hextorq is a premier AI software development company engineering custom web apps, mobile apps, SaaS products, and business automation systems.',
    canonical: `${BASE_URL}/`,
    keywords:
      'AI Software Development Company, AI Development, Web Development, Custom Software, Mobile App Development, Business Automation, PayPanda, PrintPanda',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
    ],
  },
  '/about/': {
    title: 'About Hextorq — AI & Enterprise Software Engineering',
    description:
      'Learn about Hextorq, a full-spectrum software engineering firm building scalable web applications, mobile apps, custom ERPs, and SaaS innovations.',
    canonical: `${BASE_URL}/about/`,
    keywords:
      'About Hextorq, Tech Company, AI Engineering Team, Software Consultants, Web Developers, App Engineers',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'About', item: `${BASE_URL}/about/` },
    ],
  },
  '/services/': {
    title: 'Services — AI Development, Web & Custom Software | Hextorq',
    description:
      'Explore Hextorq IT services: custom software engineering, React/Next.js web development, mobile apps, ERP systems, billing tools & business automation.',
    canonical: `${BASE_URL}/services/`,
    keywords:
      'AI Development, Web Development Services, Custom Software Development, Mobile App Engineering, ERP Systems, Billing Software',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'Services', item: `${BASE_URL}/services/` },
    ],
  },
  '/products/': {
    title: 'Hextorq Products — PayPanda, PrintPanda & SaaS Solutions',
    description:
      'Discover production SaaS platforms by Hextorq: PayPanda payment gateway, PrintPanda printing automation, and TicketsPanda event ticketing system.',
    canonical: `${BASE_URL}/products/`,
    keywords:
      'PayPanda, PrintPanda, TicketsPanda, Payment Gateway API, Printing Automation, Event Ticketing Software, SaaS Products',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'Products', item: `${BASE_URL}/products/` },
    ],
  },
  '/projects/': {
    title: 'Innovation & Academic Projects Lab — Hextorq',
    description:
      'Hextorq Innovation Lab empowers students & enterprises with IoT prototyping, custom hardware builds, and end-to-end academic software engineering.',
    canonical: `${BASE_URL}/projects/`,
    keywords:
      'IoT Prototyping, Academic Projects, Student Mentorship, Hardware Builds, Custom Engineering Projects',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'Projects', item: `${BASE_URL}/projects/` },
    ],
  },
  '/process/': {
    title: 'Our Software Engineering Process — Discovery to Launch | Hextorq',
    description:
      'How Hextorq delivers production-grade software: discovery, strategy, UI/UX design, prototyping, agile engineering, security hardening, and deployment.',
    canonical: `${BASE_URL}/process/`,
    keywords:
      'Software Engineering Process, Agile Development, UI UX Prototyping, Code Quality, Cloud Deployment',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'Process', item: `${BASE_URL}/process/` },
    ],
  },
  '/contact/': {
    title: 'Contact Hextorq — Hire AI & Software Developers',
    description:
      'Ready to engineer your next software project? Get in touch with Hextorq’s expert AI developers, software engineers, and cloud architects today.',
    canonical: `${BASE_URL}/contact/`,
    keywords:
      'Contact Hextorq, Hire AI Developers, Software Engineering Consultation, Web Development Agency',
    ogType: 'website',
    ogImage: `${BASE_URL}/favicon.svg`,
    breadcrumb: [
      { name: 'Home', item: `${BASE_URL}/` },
      { name: 'Contact', item: `${BASE_URL}/contact/` },
    ],
  },
}

export function getBreadcrumbSchema(breadcrumbItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}
