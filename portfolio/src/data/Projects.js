const code = {
    jwt: `// JWT-authenticated API call
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
    component: `@Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.html',
        changeDetection:
          ChangeDetectionStrategy.OnPush
      })
      export class DashboardComponent {}`,
    useAuth: `const useAuth = () => {
        const [token, setToken] = useState(null);
        const login = async (creds) => {
          const res = await api.post('/auth', creds);
          setToken(res.data.token);
        };
        return { token, login };
      }`,
    fetch: `const fetchData = async (url) => {
        const headers = {
          Authorization: \`Bearer \${getToken()}\`
        };
        const res = await fetch(url, { headers });
        return res.json();
      };`,
    drupal: `// Drupal theme — custom JS module
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
    gsap: `gsap.registerPlugin(ScrollTrigger);
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
    magnetic: `// Magnetic cursor effect
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
    clip: `// Clip-path scroll reveal
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
    psdtohtml: `/* PSD → Pixel-perfect HTML */
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
    useQuery: `const useQuery = (key, fn) => {
        const [data, setData] = useState();
            useEffect(() => {
                fn().then(setData);
            }, [key]);
        return data;
      }`,
    stream: `const stream = new ReadableStream({
        async start(ctrl) {
          for await (const chunk of llm) {
            ctrl.enqueue(chunk);
          }
        } 
      });`,
    css: `@keyframes glitch {
        0% { clip-path: inset(40% 0 60% 0) }
        25% { clip-path: inset(10% 0 80% 0) }
        50% { clip-path: inset(70% 0 10% 0) }
      }`,
    jQuery: `// Before: jQuery spaghetti
      $('#submit').on('click', function() {
        $.ajax({ url: '/api/save', ... });
      });

      // After: React + Redux
      const handleSubmit = () => {
        dispatch(saveFormAsync(formData));
      };`,
    injectable: `@Injectable({ providedIn: 'root' })
      export class LeaveService {
        leaves$ = this.http
          .get<Leave[]>('/api/leaves')
          .pipe(
            map(l => l.filter(
              x => x.status === 'pending')),
            catchError(this.handleError)
          );
      }`,
    usetickets: `const useTickets = (agentId) =>
      useQuery({
        queryKey: ['tickets', agentId],
        queryFn: () =>
          api.get(\`/tickets?agent=\${agentId}\`),
        refetchInterval: 15_000,
        staleTime: 10_000,
      });`,
    button: `export const Button = forwardRef<
        HTMLButtonElement, ButtonProps
      >(({ variant = 'primary',
          size = 'md',
          children,
          ...props }, ref) => (
        <button
          ref={ref}
          className={cn(base, variants[variant],
                        sizes[size])}
          {...props}
        >
          {children}
        </button>
      ));`,
    redux: `const slice = createSlice({
      name: 'analytics',
      initialState,
      reducers: {
        setDateRange: (state, { payload }) => {
          state.range = payload;
        },
      },
      extraReducers: (b) =>
        b.addCase(fetchStats.fulfilled,
          (state, { payload }) => {
            state.data = payload;
          }),
    });`,
    
};

export const PROJECTS = [
  {
    label: "HP PRE",
    name: "PRE Tool",
    desc: "Partner Rebate Estimator used daily by HP's worldwide Distributor and Reseller partners to estimate deal rebates. Built with React and ASP.NET Core — consumed REST APIs, implemented JWT authentication, route protection, and rendered complex business-logic-driven tables.",
    tags: ["React", "JWT", "REST APIs", "React Hooks", "Performance", "Redux", "Tailwind"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: code.jwt,
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
    code: code.component,
  },
  {
    label: "HP TSGA",
    name: "Enterprise React Migration",
    desc: "Revamped legacy applications into scalable React-based frontends with reusable architecture and optimized performance.",
    tags: ["React", "Redux", "Material UI", "ASP.NET APIs", "JWT", "Tailwind", "Performance", "React Hooks"],
    demo: "#",
    github: "#",
    showDemo: false,
    showGithub: false,
    client: "HP (Hewlett Packard)",
    code: code.useAuth,
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
    code: code.fetch,
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
    code: code.stream,
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
    code: code.css,
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
    code: code.drupal,
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
    code: code.gsap,
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
    code: code.magnetic,
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
    code: code.clip,
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
    code: code.psdtohtml,
  },
];