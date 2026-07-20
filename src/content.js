/**
 * ─────────────────────────────────────────────────────────────
 *  HEXTORQ — SITE CONTENT (SEO & E-E-A-T OPTIMIZED)
 * ─────────────────────────────────────────────────────────────
 *  Single source of truth for all copy. Natural language integration
 *  of target keywords: AI Software Development Company, AI Development,
 *  Web Development, Custom Software, Mobile App Development, Business Automation.
 * ─────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'HEXTORQ',
  intro: 'HEXTORQ',
  tagline: 'Code · Innovate · Elevate',
  taglineWords: ['Code', 'Innovate', 'Elevate'],
  email: 'hello@hextorq.tech',
  domain: 'hextorq.tech',
  location: 'India · Remote-first',
  socials: [
    { label: 'X', href: 'https://twitter.com/hextorq' },
    { label: 'Instagram', href: 'https://instagram.com/hextorq' },
    { label: 'YouTube', href: 'https://youtube.com/@hextorq' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/hextorq' },
  ],
}

export const nav = [
  { label: 'About', target: 'story' },
  { label: 'Services', target: 'services' },
  { label: 'Products', target: 'products' },
  { label: 'Projects', target: 'projects' },
  { label: 'Process', target: 'process' },
  { label: 'FAQ', target: 'faq' },
  { label: 'Contact', target: 'contact' },
]

export const hero = {
  eyebrow: 'AI SOFTWARE DEVELOPMENT COMPANY · CUSTOM IT SOLUTIONS',
  title: ['We build the', 'technology that', 'moves the future.'],
  subtitle:
    'Hextorq is a premier AI software development company engineering custom web apps, mobile apps, enterprise SaaS platforms, and intelligent business automation solutions.',
  cta: { label: 'Explore Our Services', target: 'services' },
  scrollHint: 'Scroll to begin',
}

export const story = {
  eyebrow: 'WHO WE ARE',
  heading: 'We turn ambitious ideas into production-grade software.',
  paragraphs: [
    'Hextorq is a full-spectrum AI software development company. We design, engineer, and operate resilient software end-to-end — adhering to high security, scale, and performance standards.',
    'Our engineering operates across three core pillars: custom software development for enterprises, a growing suite of live SaaS products, and an innovation lab mentoring future developers and hardware makers.',
    'Whether engineering complex web applications, native mobile apps, automated payment gateways, or enterprise ERP systems — our mission remains focused: deliver clean, high-performing code that scales.',
  ],
  stats: [
    { value: '250+', label: 'Projects Delivered' },
    { value: '3', label: 'Live SaaS Products' },
    { value: '500+', label: 'Students Mentored' },
    { value: '50+', label: 'Enterprise Clients' },
  ],
}

/* ── PILLAR 1 — SERVICES ──────────────────────────────────────── */
export const services = {
  eyebrow: 'PILLAR 01 — OUR IT SERVICES',
  heading: 'Enterprise IT & AI Development Services.',
  subheading:
    'From intelligent AI automation to enterprise web and mobile applications — strategy, UI/UX, engineering, and delivery under one roof.',
  items: [
    {
      id: 'software',
      index: '01',
      title: 'Software Development & AI',
      summary: 'Custom software engineering, AI workflow automation, APIs, and scalable cloud backends.',
      points: ['AI workflow automation', 'Custom web backends', 'REST & GraphQL APIs', 'Cloud architecture'],
    },
    {
      id: 'web',
      index: '02',
      title: 'Web Development',
      summary: 'Fast, accessible, conversion-driven websites and web applications built for search visibility.',
      points: ['React & Next.js platforms', 'Headless CMS', 'SEO & Core Web Vitals', 'Responsive web design'],
    },
    {
      id: 'app',
      index: '03',
      title: 'Mobile App Development',
      summary: 'Cross-platform native iOS & Android applications engineered for seamless user experience.',
      points: ['React Native & Flutter', 'Realtime web sockets', 'Push notifications', 'App Store & Play Store delivery'],
    },
    {
      id: 'erp',
      index: '04',
      title: 'Custom ERP Software',
      summary: 'Unify operational workflows — inventory management, HR, sales, and analytics — in one connected dashboard.',
      points: ['Inventory management', 'HR & payroll systems', 'CRM integrations', 'Realtime analytics'],
    },
    {
      id: 'billing',
      index: '05',
      title: 'GST Billing Software',
      summary: 'GST-compliant invoicing and POS automation designed for speed at point-of-sale and financial accuracy.',
      points: ['GST compliance', 'POS counter speed', 'Financial reporting', 'Multi-branch sync'],
    },
    {
      id: 'custom',
      index: '06',
      title: 'Business Automation',
      summary: 'Streamline repetitive enterprise tasks with custom automation scripts, bots, and integration pipelines.',
      points: ['Process automation', 'Legacy system modernization', 'Security compliance', '24/7 technical support'],
    },
  ],
}

/* ── PILLAR 2 — PRODUCTS ──────────────────────────────────────── */
export const products = {
  eyebrow: 'PILLAR 02 — HEXTORQ PRODUCTS',
  heading: 'Production SaaS Platforms Engineered by Hextorq.',
  subheading:
    'Proprietary SaaS platforms designed, built, and operated daily by Hextorq for payment processing, automated printing, and event ticketing.',
  items: [
    {
      id: 'paypanda',
      name: 'PayPanda',
      category: 'Payment Gateway Platform',
      description:
        'A secure, developer-first payment gateway offering clean APIs, instant tokenization, fraud prevention, and rapid settlement integration.',
      features: [
        'Unified Payments API',
        'PCI-DSS Compliant Security',
        'AI Fraud Detection',
        'Instant Settlement Reports',
      ],
      accent: '#3d6bff',
      href: '#',
      status: 'Live',
    },
    {
      id: 'printpanda',
      name: 'PrintPanda',
      category: 'Printing Automation Software',
      description:
        'End-to-end cloud printing automation. Customers upload files, pay online, and send jobs directly to print queues without manual intervention.',
      features: [
        'Upload → Pay → Auto Print',
        'Automated Job Queues',
        'Integrated Payment Gateway',
        'SMS & Email Notifications',
      ],
      accent: '#6a5cff',
      href: '#',
      status: 'Live',
    },
    {
      id: 'ticketspanda',
      name: 'TicketsPanda',
      category: 'Event Ticketing System',
      description:
        'Complete event registration and ticketing platform with automated digital ticket delivery and QR-code entry management.',
      features: [
        'Event Registration Portal',
        'Instant Payment Processing',
        'Automated QR Tickets',
        'Mobile Check-in Scanner',
      ],
      accent: '#7c3aed',
      href: '#',
      status: 'Live',
    },
  ],
}

/* ── PILLAR 3 — PROJECTS & INNOVATION ─────────────────────────── */
export const projects = {
  eyebrow: 'PILLAR 03 — INNOVATION LAB',
  heading: 'Where Ideas & Engineering Talent Converge.',
  subheading:
    'Hextorq Innovation Lab empowers student builders, hardware creators, and enterprises with custom prototypes and technical guidance.',
  items: [
    {
      id: 'academic',
      title: 'Student & Academic Projects',
      summary:
        'Guided final-year software and research projects with clean source code, architecture diagrams, and comprehensive documentation.',
      tags: ['All Software Domains', 'Expert Mentorship', 'Complete Documentation', 'Viva-Ready Builds'],
    },
    {
      id: 'iot',
      title: 'IoT & Hardware Prototyping',
      summary:
        'Sensors, microcontrollers, and connected embedded devices built from workbench prototype to functional hardware demo.',
      tags: ['Embedded Systems', 'IoT Sensors', 'Hardware Automation', 'Rapid Prototyping'],
    },
    {
      id: 'custom',
      title: 'Custom Engineering Builds',
      summary:
        'Specialized, on-demand software builds scoped and engineered for unique industry requirements and emerging web standards.',
      tags: ['Custom Scope', 'Cross-Industry', 'End-to-End Delivery', 'Production Ready'],
    },
  ],
}

/* ── PRODUCT SHOWCASE ─────────────────────────────────────────── */
export const showcase = {
  eyebrow: 'PRODUCT SHOWCASE',
  heading: 'Three Platforms. One Unified Ecosystem.',
  image:
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2400&auto=format&fit=crop',
  cards: [
    {
      tag: 'Payments',
      title: 'PayPanda',
      description:
        'Developer-first payment gateway API with fraud protection and instant settlement reporting.',
      bgColor: '#0c1a3f',
      textColor: '#eaf0ff',
      href: '#',
      icon: 'payment',
    },
    {
      tag: 'Printing',
      title: 'PrintPanda',
      description:
        'Automated cloud printing workflow allowing users to upload, pay, and queue print jobs seamlessly.',
      bgColor: '#1a5bcf',
      textColor: '#ffffff',
      href: '#',
      icon: 'printing',
    },
    {
      tag: 'Ticketing',
      title: 'TicketsPanda',
      description:
        'Automated event management, payment collection, and digital QR ticket verification.',
      bgColor: '#160c33',
      textColor: '#ece6ff',
      href: '#',
      icon: 'ticketing',
    },
  ],
}

/* ── PROCESS — 8-step software lifecycle ───────────────────────── */
export const process = {
  eyebrow: 'HOW WE WORK',
  heading: 'Our Software Engineering Process.',
  steps: [
    {
      no: '01',
      title: 'Discover',
      text: 'We analyze your business goals, target audience, and architecture requirements to outline an optimal project roadmap.',
    },
    {
      no: '02',
      title: 'Strategize',
      text: 'We define milestone deliverables, tech stack choices (React, Node, Cloud), and security protocols for measurable execution.',
    },
    {
      no: '03',
      title: 'UI/UX Design',
      text: 'Responsive wireframes and accessible UI design system creation focusing on intuitive user journeys and conversions.',
    },
    {
      no: '04',
      title: 'Prototype',
      text: 'Interactive prototypes built early to test usability, refine user flows, and validate core features before full production build.',
    },
    {
      no: '05',
      title: 'Agile Engineering',
      text: 'Clean, modular, and tested code written in short sprint cycles with weekly continuous deployment updates.',
    },
    {
      no: '06',
      title: 'Security & QA Testing',
      text: 'Comprehensive automated test suites, performance optimization, and vulnerability scans to ensure zero-downtime reliability.',
    },
    {
      no: '07',
      title: 'Deployment & Launch',
      text: 'Seamless cloud deployment on scalable server infrastructure with active SSL, CDN distribution, and monitoring.',
    },
    {
      no: '08',
      title: 'Continuous Optimization',
      text: 'Post-launch performance tracking, feature enhancements, SEO maintenance, and infrastructure scaling support.',
    },
  ],
}

/* ── FAQS SECTION (E-E-A-T & HELPFUL CONTENT COMPLIANT) ────────── */
export const faqs = {
  eyebrow: 'FREQUENTLY ASKED QUESTIONS',
  heading: 'Everything You Need to Know About Working with Hextorq.',
  items: [
    {
      question: 'What makes Hextorq an industry-leading AI software development company?',
      answer:
        'Hextorq combines modern AI development capabilities with deep enterprise software engineering experience. We build custom web applications, native mobile apps, and scalable SaaS platforms engineered for security, speed, and search visibility.',
    },
    {
      question: 'What technologies does Hextorq use for web and app development?',
      answer:
        'We use cutting-edge technology stacks including React, Next.js, Node.js, Python for AI services, React Native and Flutter for mobile applications, along with AWS/Vercel cloud infrastructure.',
    },
    {
      question: 'Can Hextorq build custom ERP or Billing software for my enterprise?',
      answer:
        'Yes. We build custom ERP systems tailored to your specific business operations, including inventory tracking, HR, CRM, and automated GST billing software that integrates directly into your workflow.',
    },
    {
      question: 'How do PayPanda, PrintPanda, and TicketsPanda work?',
      answer:
        'PayPanda is our developer-friendly payment gateway API; PrintPanda automates online file upload to printer queue workflows; and TicketsPanda manages event registration and automated QR ticket issuance.',
    },
    {
      question: 'What is the typical timeline for custom software development?',
      answer:
        'Timelines depend on project complexity. Standard web applications take 2 to 4 weeks, while full enterprise platforms or complex AI integrations typically range from 6 to 12 weeks with weekly milestone demos.',
    },
  ],
}

export const marqueeWords = [
  'AI Software Engineering',
  'Web Development',
  'Mobile App Engineering',
  'Custom Enterprise Software',
  'PayPanda Gateway',
  'PrintPanda Automation',
  'IoT & Hardware Prototyping',
  'Core Web Vitals Optimization',
]

export const contact = {
  eyebrow: 'LET’S BUILD TOGETHER',
  heading: ['Ready to build your', 'next software project?'],
  subtitle:
    'Whether you need custom AI software development, web app engineering, or SaaS deployment — contact Hextorq’s team today.',
  cta: { label: 'Start a Project Conversation', href: 'mailto:hello@hextorq.tech' },
}

export const footer = {
  tagline: 'Hextorq — Engineering enterprise software, mobile apps, and SaaS innovations.',
  columns: [
    {
      title: 'SaaS Products',
      links: [
        { label: 'PayPanda Gateway', href: '#products' },
        { label: 'PrintPanda Automation', href: '#products' },
        { label: 'TicketsPanda Events', href: '#products' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'AI & Software Engineering', href: '#services' },
        { label: 'Web Development', href: '#services' },
        { label: 'Mobile App Development', href: '#services' },
        { label: 'ERP & Billing Software', href: '#services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#story' },
        { label: 'Engineering Process', href: '#process' },
        { label: 'Innovation Lab', href: '#projects' },
      ],
    },
  ],
  wordmark: 'HEXTORQ',
  legal: [
    { label: 'Security', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  copyright: `© ${new Date().getFullYear()} Hextorq Tech Solutions. All rights reserved.`,
}
