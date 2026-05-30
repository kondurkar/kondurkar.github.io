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
    stack: ["Drupal", "Hugo", "HTML5", "SCSS", "JavaScript", "Git"],
  },
  {
    date: "Jan 2019 — Jan 2020",
    role: "Frontend Developer",
    company: "Webmaffia — Malad, Mumbai",
    desc: "Converted PSD designs to responsive, animated HTML using JavaScript, jQuery, and Sass. Created interactive prototypes, performed cross-browser testing, and handled ongoing website maintenance.",
    stack: ["HTML5", "CSS3", "Sass", "JavaScript", "jQuery"],
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
    stack: ["WordPress", "JavaScript", "jQuery", "HTML Emailers", "E-commerce"],
  },
];

export const PROJECTS = [
  {
    label: "LYRICA",
    name: "Lyrica.com — Pfizer Inc.",
    desc: "Built and maintained the Lyrica brand website for Pfizer Inc., a pharmaceutical giant. Delivered responsive, accessible, and compliant frontend interfaces using Drupal CMS, HTML, CSS, and JavaScript.",
    tags: ["Drupal", "HTML5", "CSS3", "JavaScript"],
    demo: "https://www.lyrica.com/",
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
    label: "HP PRE",
    name: "HP PRE Tool — Hewlett Packard",
    desc: "Partner Rebate Estimator used daily by HP's worldwide Distributor and Reseller partners to estimate deal rebates. Built with React and ASP.NET Core — consumed REST APIs, implemented JWT authentication, route protection, and rendered complex business-logic-driven tables.",
    tags: ["React", "ASP.NET Core", "JWT", "REST APIs", "React Hooks"],
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
    label: "WEB",
    name: "Client Websites — Early Career",
    desc: "Pixel-perfect HTML/CSS/JS websites built from PSD designs for clients across energy, real estate, and manufacturing sectors. Projects include Nayara Energy, Sahana Realty, Ambience, Uni Tile India, and ACIPL.",
    tags: ["HTML5", "CSS3", "JavaScript", "jQuery", "PSD to HTML"],
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
  {
    label: "HP MCO",
    name: "HP Enterprise React Migration",
    desc: "Revamped legacy applications into scalable React-based frontends with reusable architecture and optimized performance.",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs"],
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
    label: "HP Prism",
    name: "Scalable UI System",
    desc: "Built responsive component-driven interfaces integrated with enterprise backend systems and authentication flows.",
    tags: ["Angular", "Tailwind", "Material UI"],
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
    label: "HP CMS",
    name: "HP CMS & Web Platforms",
    desc: "Developed high-performance CMS websites and responsive digital experiences for enterprise and marketing platforms.",
    tags: ["Drupal", "WordPress", "SCSS", "Gulp"],
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
];

// ── Formspree ──────────────────────────────────────────────
// 1. Sign up at https://formspree.io
// 2. Create a new form
// 3. Paste your form ID below (the part after /f/)
export const FORMSPREE_ID = "YOUR_FORM_ID";
