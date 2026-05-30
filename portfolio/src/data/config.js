// ============================================================
//  PORTFOLIO CONFIG — edit everything here, nowhere else
// ============================================================

export const ME = {
  name: "Yogesh Kondurkar",
  role: "Senior Frontend Developer & UI Engineer",
  tagline: "Building interfaces that matter.",
  subline: "10+ years crafting fast, accessible, and scalable web experiences. React, Angular, TypeScript — and a deep obsession with clean code.",
  location: "Mumbai, IN",
  email: "kondurkaryogesh4@gmail.com",
  available: true,
  availableText: "Open to Senior Frontend Developer roles",
  resumeUrl: "/Yogesh_Kondurkar_Senior_Frontend_Engineer.pdf",
  social: {
    github: "https://github.com/kondurkar",
    linkedin: "https://www.linkedin.com/in/yogesh-kondurkar",
  },
};

export const STATS = [
  { num: "10+", label: "Years exp" },
  { num: "5", label: "Companies" },
  { num: "50+", label: "Projects" },
  { num: "∞", label: "Commits" },
];

export const ABOUT_PARAGRAPHS = [
  `I'm a <strong>Senior Frontend Developer</strong> based in Mumbai with 10+ years of experience crafting responsive, scalable, and performance-optimized web applications. I thrive at the intersection of design and engineering — turning complex requirements into intuitive, accessible interfaces.`,
  `I'm proficient in <strong>React.js, Angular, and TypeScript</strong>, with a strong command of HTML5, CSS3, and modern UI frameworks. I've worked across the stack with REST APIs, JWT authentication, Redux, and have solid awareness of ASP.NET and microservices backends.`,
  `I also leverage <strong>AI-powered developer tools</strong> like GitHub Copilot and Claude to accelerate delivery and elevate code quality. I'm a collaborative team player with a passion for clean code, mentorship, and continuous improvement.`,
];

export const SKILLS = [
  {
    icon: "⚛️",
    name: "React.js & Angular",
    desc: "Component architecture, hooks, Redux, Context API, micro frontends",
    level: 97,
    tags: ["React.js", "Angular", "Redux", "Context API"],
  },
  {
    icon: "🔷",
    name: "TypeScript & JavaScript",
    desc: "ES6+, TypeScript, strict mode — clean, type-safe codebases",
    level: 95,
    tags: ["TypeScript", "ES6+", "JS", "jQuery"],
  },
  {
    icon: "🎨",
    name: "CSS & UI Frameworks",
    desc: "Tailwind, SCSS, Material UI, responsive design, Figma handoff",
    level: 96,
    tags: ["Tailwind", "SCSS", "Material UI", "Figma"],
  },
  {
    icon: "🔗",
    name: "API Integration",
    desc: "REST APIs, WebSockets, JWT authentication, route protection",
    level: 90,
    tags: ["REST APIs", "JWT", "WebSockets", "ASP.NET"],
  },
  {
    icon: "🛠️",
    name: "Build & DevOps",
    desc: "Webpack, Gulp, Azure DevOps, CI/CD, Git, GitHub, Bitbucket",
    level: 85,
    tags: ["Webpack", "Azure DevOps", "Git", "CI/CD"],
  },
  {
    icon: "🤖",
    name: "AI Dev Tools",
    desc: "GitHub Copilot, Claude, ChatGPT — for code gen, debugging & docs",
    level: 90,
    tags: ["GitHub Copilot", "Claude", "ChatGPT"],
  },
];

export const EXPERIENCE = [
  {
    date: "Aug 2021 — Present",
    role: "Senior UI Consultant",
    company: "Infogain — Andheri, Mumbai",
    desc: "Developed scalable frontend interfaces using React and Angular integrated with ASP.NET and Java backends. Translated Figma designs into pixel-perfect components, implemented JWT auth and Redux state management, and mentored junior developers on best practices. Revamped legacy applications by migrating to modern React-based frontends.",
    stack: [
      "React.js",
      "Angular",
      "JavaScript",
      "TypeScript",
      "Redux",
      "REST APIs",
      "JWT",
      "Figma",
    ],
  },
  {
    date: "Jan 2020 — Aug 2021",
    role: "IT Analyst",
    company: "TCS — Powai, Mumbai",
    desc: "Built websites and web apps using Drupal, Hugo, and Canvas Web Builder. Developed responsive UIs with HTML, CSS/SCSS, JavaScript, and jQuery. Conducted performance audits, shared optimization strategies with stakeholders, and collaborated with teams using Git.",
    stack: ["Drupal", "Hugo", "HTML5", "SCSS", "JavaScript", "jQuery", "Git"],
  },
  {
    date: "Jan 2019 — Jan 2020",
    role: "Frontend Developer",
    company: "Webmaffia — Malad, Mumbai",
    desc: "Converted PSD designs to responsive, animated HTML using JavaScript, jQuery, and Sass. Created interactive prototypes, performed cross-browser testing, and handled ongoing website maintenance.",
    stack: ["HTML5", "CSS3", "SCSS", "JavaScript", "jQuery", "Bootstrap", "Git"],
  },
  {
    date: "Jan 2017 — Jan 2019",
    role: "Frontend Developer",
    company: "Crystal Logic — Goregaon, Mumbai",
    desc: "Built high-quality pixel-perfect websites from PSD files. Developed landing pages, coded HTML emailers, and ensured cross-browser compatibility across all deliverables.",
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "Emailers"],
  },
  {
    date: "Aug 2015 — Dec 2016",
    role: "Web Developer",
    company: "Fruitbowl Digital — Andheri, Mumbai",
    desc: "Created WordPress websites and e-commerce platforms. Used JavaScript and jQuery to build interactive features and responsive layouts. Designed and coded HTML emailers for multiple clients.",
    stack: ["WordPress", "CSS3", "JavaScript", "jQuery", "HTML Emailers", "E-commerce"],
  },
];

export const PROJECTS = [
  {
    label: "HP PRE",
    name: "HP PRE Tool — Hewlett Packard",
    desc: "Partner Rebate Estimator used daily by HP's worldwide Distributor and Reseller partners to estimate deal rebates. Built with React and ASP.NET Core — consumed REST APIs, implemented JWT authentication, route protection, and rendered complex business-logic-driven tables.",
    tags: ["React", "ASP.NET Core", "JWT", "REST APIs", "React Hooks", "Performance", "Redux", "Tailwind"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `// JWT-authenticated API call
      const fetchRebateData = async (dealId) => {
        const token = getToken();
        const res = await fetch(
          \`/api/rebate/estimate/\${dealId}\`,
          { headers: {
              Authorization: \`Bearer \${token}\`,
              'Content-Type': 'application/json'
          }}
        );
        return res.json();
      };`,
  },
  {
    label: "HP Prism",
    name: "Scalable UI System",
    desc: "Built responsive component-driven interfaces integrated with enterprise backend systems and authentication flows.",
    tags: ["Angular", "Tailwind", "Material UI", "Performance", "Redux",  "JWT", "REST APIs"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `@Component({
      selector: 'app-dashboard',
      templateUrl: './dashboard.html',
      changeDetection:
        ChangeDetectionStrategy.OnPush
    })
    export class DashboardComponent {}`,
  },
  {
    label: "HP TSGA",
    name: "HP Enterprise React Migration",
    desc: "Revamped legacy applications into scalable React-based frontends with reusable architecture and optimized performance.",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs", "JWT", "Tailwind", "Performance", "React Hooks"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `const useAuth = () => {
      const [token, setToken] = useState(null);
      const login = async (creds) => {
        const res = await api.post('/auth', creds);
        setToken(res.data.token);
      };
      return { token, login };
    }`,
  },
  {
    label: "HP USM",
    name: "Global Order Management Dashboard",
    desc: "Developed a React-based enterprise dashboard for managing global order backlog, load planning, and revenue projections across multiple business units. Built dynamic data tables, interactive charts, and reporting modules that enabled business users to analyze operational performance and make informed decisions. Focused on performance optimization, reusable component architecture, and seamless integration with backend APIs.",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs", "Performance", "JWT", "REST APIs", "React Hooks"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `const fetchData = async (url) => {
      const headers = {
        Authorization: \`Bearer \${getToken()}\`
      };
      const res = await fetch(url, { headers });
      return res.json();
    };`,
  },
  {
    label: "HP MCO",
    name: "Enterprise Planning & Simulation Portal",
    desc: "Built a scalable planning and simulation platform that allowed users to model different business scenarios and evaluate their impact on key performance metrics. Implemented configurable dashboards, hierarchical data views, and real-time calculations using React and modern frontend technologies. Enhanced application maintainability through component reusability, code optimization, and improved user experience..",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs", "JWT", "REST APIs", "React Hooks", "Performance"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `const fetchData = async (url) => {
      const headers = {
        Authorization: \`Bearer \${getToken()}\`
      };
      const res = await fetch(url, { headers });
      return res.json();
    };`,
  },
  {
    label: "HP Ondemand",
    name: "Financial Analytics & Payment Insights Platform",
    desc: "Designed and implemented a financial reporting application that provided payment analysis, currency conversion insights, and forecasting capabilities. Developed advanced table structures with drill-down functionality, interactive visualizations, and Excel export features. Collaborated with stakeholders to transform complex financial data into actionable business intelligence.",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs", "JWT", "REST APIs", "React Hooks", "Performance"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: `const fetchData = async (url) => {
      const headers = {
        Authorization: \`Bearer \${getToken()}\`
      };
      const res = await fetch(url, { headers });
      return res.json();
    };`,
  },
  {
    label: "Pfizer Inc.",
    name: "LYRICA, Talking UC, Suspect & Detect",
    desc: "Built and maintained brand websites  for LYRICA, Talking UC, Suspect & Detect of Pfizer Inc. Delivered responsive, accessible, and compliance-ready frontend interfaces using Drupal CMS, HTML, CSS, and JavaScript.",
    tags: ["Drupal", "HTML5", "CSS3", "JavaScript", "Performance", "Responsive Design", "Cross-browser Compatibility", "Accessibility"],
    demo: "#",
    github: "#",
    showDemo: true,
    showGithub: false,
    client: "Pfizer Inc.",
    code: `// Drupal theme — custom JS module
      (function ($, Drupal) {
        Drupal.behaviors.lyricaHero = {
          attach: function (context) {
            $('.hero-banner', context)
              .once('lyrica-hero')
              .each(function () {
                initHeroAnimation(this);
              });
          }
        };
      })(jQuery, Drupal);`,
  },
  {
    label: "LUXURY RE",
    name: "Luxury Real Estate Website",
    desc: "Converted a high-fidelity PSD into a fully animated luxury real estate website. Scroll-triggered property reveals, parallax hero, CSS counter animations on stats, and hover micro-interactions — built with GULP and hand-written CSS, zero UI frameworks.",
    tags: ["HTML5", "CSS3", "jQuery", "JavaScript", "GULP", "PSD to HTML", "Animation", "Performance", "Responsive Design", "Bootstrap", "Cross-browser Compatibility", "Accessibility"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "Confidential — Real Estate",
    code: `gsap.registerPlugin(ScrollTrigger);
      gsap.from('.property-card', {
        scrollTrigger: {
          trigger: '.listings',
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });`,
  },

  {
    label: "AGENCY",
    name: "Creative Agency Landing Page",
    desc: "Pixel-perfect PSD-to-HTML build for a digital agency — full-screen hero with typed-text effect, magnetic cursor, SVG path animations, staggered section reveals, and smooth page transitions. Delivered to 0.5px accuracy against the original Photoshop design.",
    tags: ["HTML5", "CSS3", "SCSS", "jQuery", "JavaScript", "GULP", "SVG Animation", "PSD to HTML", "Performance", "Bootstrap", "Cross-browser Compatibility", "Responsive Design", "Accessibility"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "Confidential — Agency",
    code: `// Magnetic cursor effect
      document.querySelectorAll('[data-magnetic]')
        .forEach(el => {
          el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width/2;
            const y = e.clientY - r.top - r.height/2;
            gsap.to(el, {
              x: x * 0.3,
              y: y * 0.3,
              duration: 0.4,
              ease: 'power2.out'
            });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x:0, y:0, duration:0.4 });
          });
        });`,
  },
  {
    label: "PORTFOLIO TPL",
    name: "Animated Portfolio Template",
    desc: "High-performance animated portfolio from a PSD design — split-screen hero, scroll-linked progress bar, clip-path wipe reveals, and a CSS dark/light theme toggle. Scored 98 on Google Lighthouse performance with zero JS frameworks.",
    tags: ["HTML5", "CSS3", "SCSS", "jQuery", "JavaScript", "GULP", "Animation", "PSD to HTML", "Performance", "Bootstrap", "Cross-browser Compatibility", "Responsive Design", "Accessibility"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "Personal / Freelance",
    code: `// Clip-path scroll reveal
      const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting)
            e.target.classList.add('revealed');
        }), { threshold: 0.2 }
      );
      document.querySelectorAll('.reveal')
        .forEach(el => observer.observe(el));

      /* CSS */
      /* .reveal {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 0.8s
          cubic-bezier(0.77,0,0.18,1);
      }
      .reveal.revealed {
        clip-path: inset(0 0% 0 0);
      } */`,
  },
  {
    label: "WEB",
    name: "Client Websites — Early Career",
    desc: "Pixel-perfect HTML/CSS/JS websites built from PSD designs for clients across energy, real estate, and manufacturing sectors. Projects include Nayara Energy, Sahana Realty, Ambience, Uni Tile India, and ACIPL.",
    tags: ["HTML5", "CSS3", "JavaScript", "jQuery", "PSD to HTML", "Performance", "Responsive Design", "Bootstrap", "Cross-browser Compatibility"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "Various",
    websites: [
      { label: "ACIPL", url: "https://www.acipl.net/" },
      { label: "Nayara Energy", url: "https://nayaraenergy.com/" },
      { label: "Sahana Realty", url: "https://sahanarealty.com/" },
      { label: "Ambience", url: "http://ambience.net.in/" },
      { label: "UniTile India", url: "https://www.unitileindia.com/" },
    ],
    code: `/* PSD → Pixel-perfect HTML */
      .hero-section {
        background: url('hero.jpg')
          center/cover no-repeat;
        display: flex;
        align-items: center;
        min-height: 100vh;
      }
      .cta-button {
        transition: transform 0.3s ease,
                    box-shadow 0.3s ease;
      }`,
  },
];

// ── Formspree ──────────────────────────────────────────────
// 1. Sign up at https://formspree.io
// 2. Create a new form
// 3. Paste your form ID below (the part after /f/)
export const FORMSPREE_ID = "YOUR_FORM_ID";
