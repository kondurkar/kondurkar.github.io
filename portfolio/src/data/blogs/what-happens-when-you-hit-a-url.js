export default {
  slug: "what-happens-when-you-hit-a-url",
  title: "What Happens When You Hit a URL in the Browser?",
  date: "Jun 2026",
  readTime: "9 min read",
  tags: ["Web", "DNS", "Networking", "Browser"],
  excerpt:
    "You type a URL and hit Enter. Less than a second later, a webpage appears. But what actually happened? DNS lookups, TCP handshakes, TLS negotiation, HTTP requests — here's the full journey from keystroke to rendered page.",
  content: `
## The Journey of a URL

You type \`https://www.example.com\` into your browser and press Enter. A webpage loads in milliseconds. Behind that simple action is a remarkable chain of events involving your OS, multiple servers across the world, and your browser's rendering engine. Let's walk through every step.

## Step 1 — URL Parsing

Before anything goes over the network, the browser parses the URL into its components:

\`\`\`
https://www.example.com/products?id=42#reviews
│       │               │        │     │
│       │               │        │     └── Fragment (client-side only)
│       │               │        └──────── Query string
│       │               └───────────────── Path
│       └───────────────────────────────── Host
└───────────────────────────────────────── Protocol (scheme)
\`\`\`

The browser checks if it's a valid URL or a search query. If it's a search query, it sends it to the default search engine instead.

## Step 2 — Check the Cache

Before making any network request, the browser checks multiple caches in order:

**Browser cache** — Has this URL been fetched recently? Is it still fresh based on Cache-Control headers?

**DNS cache** — Does the browser already know the IP address for this hostname?

**OS cache** — Checked next if the browser cache misses.

**Router cache** — Your home router may have seen this hostname before.

If any cache has a valid, unexpired answer — we skip the DNS step entirely and go straight to connecting.

## Step 3 — DNS Lookup

DNS (Domain Name System) is the internet's phonebook — it translates \`www.example.com\` into an IP address like \`93.184.216.34\`.

If no cache has the answer, the browser asks the **OS resolver**, which queries a chain of servers:

\`\`\`
Browser → OS Resolver → Recursive Resolver (ISP or 8.8.8.8)
                              │
                              ├── Root Nameserver (.)
                              │      "I don't know, ask .com"
                              │
                              ├── TLD Nameserver (.com)
                              │      "I don't know, ask example.com's NS"
                              │
                              └── Authoritative Nameserver (example.com)
                                     "The IP is 93.184.216.34"
\`\`\`

This entire chain typically completes in **20–120ms**. The result is cached at every level with a TTL (Time To Live) so it doesn't happen on every request.

**What a DNS record looks like:**

\`\`\`
Type  Name             Value              TTL
A     www.example.com  93.184.216.34      3600
CNAME shop.example.com  example.myshop.io  300
MX    example.com       mail.example.com   3600
\`\`\`

## Step 4 — TCP Handshake

Now the browser knows the IP. It opens a **TCP connection** to port 443 (HTTPS) using a three-way handshake:

\`\`\`
Client                        Server
  │                              │
  │──── SYN ────────────────────>│   "I want to connect"
  │                              │
  │<─── SYN-ACK ────────────────│   "OK, I'm ready"
  │                              │
  │──── ACK ────────────────────>│   "Great, let's go"
  │                              │
  │    Connection established    │
\`\`\`

This takes **one round trip** — typically 10–100ms depending on physical distance to the server. This is why CDNs (Content Delivery Networks) exist — they put servers physically closer to users to reduce this latency.

## Step 5 — TLS Handshake (HTTPS)

Since we're using HTTPS, the connection must be encrypted. The **TLS handshake** negotiates the encryption:

\`\`\`
Client                              Server
  │                                    │
  │── ClientHello (TLS version, ──────>│
  │   cipher suites, random)           │
  │                                    │
  │<── ServerHello (chosen cipher, ───│
  │    certificate, random)            │
  │                                    │
  │── Verify certificate ─────────────│ (checks CA signature)
  │                                    │
  │── ClientKeyExchange ──────────────>│ (pre-master secret)
  │                                    │
  │<─────── Finished ─────────────────│ (encrypted from here)
  │                                    │
  │    Secure channel established      │
\`\`\`

Modern TLS 1.3 does this in **one round trip** instead of two. The certificate tells the client: "I am really example.com" — verified by a Certificate Authority (CA) like Let's Encrypt or DigiCert.

## Step 6 — HTTP Request

With a secure connection open, the browser sends an **HTTP request**:

\`\`\`http
GET /products?id=42 HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: en-IN,en;q=0.9
Accept-Encoding: gzip, br
Cookie: session=abc123; theme=dark
Connection: keep-alive
\`\`\`

Key headers:
- **Host** — required in HTTP/1.1, tells the server which site you want (multiple sites can share one IP)
- **Accept-Encoding** — tells the server it can send compressed responses (gzip, Brotli)
- **Cookie** — sends stored cookies for this domain (auth tokens, preferences)

## Step 7 — Server Processing

The request hits the server (or a load balancer in front of multiple servers). What happens here depends on the application:

\`\`\`
Request
   │
   ▼
Load Balancer
   │
   ▼
Web Server (Nginx / Apache)
   │
   ├── Static file? → Serve immediately from disk
   │
   └── Dynamic? → Application Server (Node.js, .NET, Java)
                        │
                        ├── Auth check (validate JWT / session)
                        ├── Business logic
                        ├── Database query
                        └── Build HTML response
\`\`\`

For a React SPA (like your portfolio), the server just returns the \`index.html\` and the browser does the rest client-side.

## Step 8 — HTTP Response

The server responds:

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Encoding: gzip
Cache-Control: max-age=3600, public
ETag: "abc123def456"
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000

<!DOCTYPE html>
<html>...
\`\`\`

Key response headers:
- **Cache-Control** — tells browsers and CDNs how long to cache this response
- **ETag** — a fingerprint of the content; browser sends it next time to check if the file changed
- **Strict-Transport-Security** — forces HTTPS on future visits

**Common status codes:**

| Code | Meaning |
|---|---|
| 200 | OK — success |
| 301 | Moved Permanently — redirect |
| 304 | Not Modified — use your cached version |
| 401 | Unauthorized — login required |
| 403 | Forbidden — not allowed |
| 404 | Not Found |
| 500 | Internal Server Error |

## Step 9 — Browser Rendering

The browser receives the HTML and starts the **Critical Rendering Path**:

**1. Parse HTML → DOM tree**
\`\`\`
html
├── head
│   ├── title
│   └── link (CSS)
└── body
    ├── header
    ├── main
    └── footer
\`\`\`

**2. Parse CSS → CSSOM tree**

Runs in parallel with HTML parsing. Blocks rendering until complete (CSS is render-blocking).

**3. JavaScript execution**

\`<script>\` tags without \`async\` or \`defer\` block HTML parsing. This is why:
\`\`\`html
<!-- Bad: blocks parsing -->
<script src="app.js"></script>

<!-- Good: doesn't block -->
<script src="app.js" defer></script>
\`\`\`

**4. DOM + CSSOM → Render Tree**

Only visible elements — \`display: none\` elements are excluded.

**5. Layout (Reflow)**

The browser calculates the exact position and size of every element.

**6. Paint**

Pixels are drawn to the screen — colors, borders, shadows, text.

**7. Composite**

Layers are composited together (GPU-accelerated) and displayed. Transforms and opacity run on the GPU — this is why they're the smoothest properties to animate.

## The Full Timeline

\`\`\`
0ms        User presses Enter
0–1ms      URL parsing + cache check
1–120ms    DNS lookup (skipped if cached)
120–200ms  TCP handshake (1 RTT)
200–350ms  TLS handshake (1–2 RTTs)
350–400ms  HTTP request sent
400–600ms  Server processing
600–800ms  Response received
800–1200ms HTML parsed, CSS loaded, JS executed
1200ms+    Page painted and interactive
\`\`\`

A well-optimised site reaches **First Contentful Paint (FCP)** in under 1 second. Google's Core Web Vitals target:

- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

## What Frontend Developers Can Do

Understanding this pipeline shows exactly where you can optimise:

- **DNS** → Use a fast DNS provider (Cloudflare 1.1.1.1) or DNS prefetching: \`<link rel="dns-prefetch" href="//api.example.com">\`
- **TCP/TLS** → Use a CDN to reduce round-trip distance
- **HTTP** → Enable compression (gzip/Brotli), use HTTP/2 multiplexing
- **Caching** → Set correct Cache-Control headers, use content-hashed filenames
- **Rendering** → Defer non-critical JS, preload key assets, avoid layout shifts

Every millisecond matters — a 100ms improvement in load time can improve conversion rates by 1%.
    `,
};
