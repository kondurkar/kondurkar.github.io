export default {
  slug: "react-authentication-authorization-jwt-guide",
  title:
    "Authentication vs Authorization in React: JWT Tokens, Storage Strategies & Secret Management",
  date: "Jun 2026",
  readTime: "12 min read",
  tags: ["React", "Security", "Authentication", "JWT", "Frontend"],
  excerpt:
    "Authentication and authorization are often confused, but they solve different security problems. Learn how login systems work, what JWT tokens are, where they should be stored, and how to securely manage secrets in modern React applications.",

  content: `
## Why Every Frontend Developer Must Understand Authentication

Almost every modern web application requires users to log in. Whether you're building an e-commerce platform, SaaS dashboard, banking application, or social media app, understanding authentication and authorization is essential.

Many developers can implement a login screen, but fewer understand:

- What happens after login
- How JWT tokens work
- Where tokens should be stored
- How APIs verify users
- How secrets should be managed

Understanding these concepts helps you build secure React applications and avoid common security vulnerabilities.

## Authentication vs Authorization

Although the terms sound similar, they solve completely different problems.

| Concept | Question Answered | Example |
|----------|------------------|---------|
| Authentication | Who are you? | Logging in with email and password |
| Authorization | What can you access? | Admin can delete users, normal users cannot |

### Authentication Example

A user enters:

\`\`\`
Email: john@example.com
Password: myPassword123
\`\`\`

The server validates the credentials and confirms the user's identity.

Result:

\`\`\`
✅ User is authenticated
\`\`\`

### Authorization Example

After authentication:

| User Role | Permission |
|------------|------------|
| Admin | Create users |
| Admin | Delete users |
| Admin | Manage settings |
| User | View profile |
| User | Update profile |

Result:

\`\`\`
✅ User authenticated
❌ User not authorized to delete users
\`\`\`

Authentication happens first.

Authorization happens second.

## Typical Login Flow

A modern login flow looks like this:

\`\`\`
User
  ↓
Login Form
  ↓
Backend API
  ↓
Validate Credentials
  ↓
Generate Token
  ↓
Return Token
  ↓
Store Token
  ↓
Authenticated Requests
\`\`\`

### Step 1: User Logs In

\`\`\`js
const response = await fetch("/api/login", {
  method: "POST",
  body: JSON.stringify({
    email,
    password
  })
});
\`\`\`

### Step 2: Backend Validates Credentials

Server checks:

- User exists
- Password is correct
- Account is active

### Step 3: Server Creates Token

Example payload:

\`\`\`json
{
  "id": 123,
  "email": "john@example.com",
  "role": "admin"
}
\`\`\`

### Step 4: Token Returned To Frontend

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

### Step 5: Frontend Stores Token

The application saves the token and uses it for future requests.

## What Is An Auth Token?

An authentication token is a digital proof that the user has already logged in.

Think of it like:

- Login = Airport Security Check
- Token = Boarding Pass

You don't show your passport at every gate.

You show your boarding pass.

Similarly:

- User logs in once
- Receives token
- Sends token with every request

## What Is JWT?

JWT stands for:

**JSON Web Token**

It is a compact token format used to securely transfer user information between client and server.

A JWT looks like this:

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJpZCI6MSwicm9sZSI6ImFkbWluIn0
.
sdf89sdf89sdf89sdf89sdf
\`\`\`

It contains three parts.

## JWT Structure

| Part | Purpose |
|--------|---------|
| Header | Token type and algorithm |
| Payload | User information |
| Signature | Prevents tampering |

### Header

\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### Payload

\`\`\`json
{
  "id": 1,
  "email": "john@example.com",
  "role": "admin"
}
\`\`\`

### Signature

Generated using:

\`\`\`
Header + Payload + Secret Key
\`\`\`

This prevents attackers from modifying the token.

## Important JWT Misconception

JWTs are NOT encrypted.

Anyone can decode:

\`\`\`
{
  "id": 1,
  "email": "john@example.com"
}
\`\`\`

Never store:

- Passwords
- Credit card numbers
- API secrets
- Sensitive personal information

inside JWT payloads.

JWTs are signed, not encrypted.

## How JWT Authentication Works

\`\`\`
Login
  ↓
Server Creates JWT
  ↓
Frontend Stores JWT
  ↓
Request API
  ↓
Authorization: Bearer <token>
  ↓
Server Verifies Signature
  ↓
Response Returned
\`\`\`

Example:

\`\`\`http
GET /api/profile

Authorization: Bearer eyJhbGciOi...
\`\`\`

Backend verifies:

- Token valid
- Signature valid
- Token not expired

Then returns data.

## Where Should JWT Tokens Be Stored?

This is one of the most debated frontend security topics.

### Option 1: localStorage

\`\`\`js
localStorage.setItem("token", token);
\`\`\`

Advantages:

- Easy to implement
- Persists across refreshes
- Survives browser restart

Disadvantages:

- Vulnerable to XSS attacks
- Any injected JavaScript can read it

Example:

\`\`\`js
const token = localStorage.getItem("token");
\`\`\`

If an attacker injects JavaScript, they can steal the token.

### Option 2: sessionStorage

\`\`\`js
sessionStorage.setItem("token", token);
\`\`\`

Advantages:

- Cleared when tab closes
- Slightly safer

Disadvantages:

- Still vulnerable to XSS

### Option 3: Memory (React State)

\`\`\`js
const [token, setToken] = useState(null);
\`\`\`

Advantages:

- Harder to steal
- Cleared on refresh

Disadvantages:

- User logs out after page refresh

### Option 4: HttpOnly Cookies (Recommended)

Store token inside:

\`\`\`
HttpOnly Cookie
\`\`\`

Advantages:

- JavaScript cannot access it
- Protects against token theft
- Industry standard

Disadvantages:

- Requires backend setup
- Must handle CSRF protection

## Token Storage Comparison

| Storage | XSS Safe | Persists Refresh | Recommended |
|-----------|-----------|------------------|-------------|
| localStorage | ❌ No | ✅ Yes | ⚠️ Sometimes |
| sessionStorage | ❌ No | ✅ Yes | ⚠️ Sometimes |
| React State | ✅ Better | ❌ No | Limited |
| HttpOnly Cookie | ✅ Yes | ✅ Yes | ✅ Best |

## React Example Using JWT

Login:

\`\`\`js
const login = async () => {
  const response = await api.login(email, password);

  localStorage.setItem(
    "token",
    response.token
  );
};
\`\`\`

Authenticated Request:

\`\`\`js
const token = localStorage.getItem("token");

fetch("/api/profile", {
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});
\`\`\`

## What Are Refresh Tokens?

Access tokens usually expire quickly.

Example:

\`\`\`
Access Token:
15 minutes
\`\`\`

To avoid forcing users to log in repeatedly:

\`\`\`
Refresh Token:
30 days
\`\`\`

Flow:

\`\`\`
Access Token Expired
        ↓
Send Refresh Token
        ↓
Server Issues New Access Token
        ↓
Continue Using App
\`\`\`

This improves both security and user experience.

## Where Should Secrets Be Stored?

One of the biggest mistakes frontend developers make is placing secrets directly inside React code.

Never do this:

\`\`\`js
const API_SECRET =
  "my-super-secret-key";
\`\`\`

Because React code ships to the browser.

Attackers can inspect:

- JavaScript bundles
- Network requests
- Source maps

and see everything.

## Frontend Secrets Don't Exist

A critical security rule:

**Anything shipped to the browser is public.**

If users can download it:

\`\`\`
It is NOT a secret.
\`\`\`

That includes:

- API keys
- Tokens
- Environment variables
- Configuration values

Frontend code is visible.

## React Environment Variables

Many developers assume:

\`\`\`
REACT_APP_API_KEY=abc123
\`\`\`

is secure.

It is not.

Environment variables are injected during build.

Users can still inspect them.

Use environment variables only for:

- API URLs
- Feature flags
- Public configuration

Example:

\`\`\`
VITE_API_URL=https://api.example.com
\`\`\`

Safe.

Example:

\`\`\`
VITE_STRIPE_SECRET_KEY=xxxx
\`\`\`

Not safe.

## Where Should Real Secrets Live?

Secrets belong on the backend.

Examples:

- Database passwords
- JWT signing keys
- Stripe secret keys
- AWS credentials
- OAuth client secrets

Backend:

\`\`\`
React App
      ↓
Backend Server
      ↓
Secret Access
\`\`\`

Only the server should know them.

## How Teams Share Secrets Securely

Instead of committing secrets to Git:

Use:

- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- GitHub Secrets
- CI/CD Secret Variables

Example:

\`\`\`
GitHub Actions
     ↓
Inject Secret
     ↓
Deployment
\`\`\`

Developers can access required secrets through secure infrastructure without exposing them publicly.

## Never Commit Secrets To Git

Bad:

\`\`\`
const DB_PASSWORD = "password123";
\`\`\`

Worse:

\`\`\`
.env
\`\`\`

committed to GitHub.

Always:

\`\`\`
.env
.env.local
.env.production
\`\`\`

inside:

\`\`\`
.gitignore
\`\`\`

## Security Best Practices

1. Use HTTPS everywhere.
2. Prefer HttpOnly cookies for authentication.
3. Keep access tokens short-lived.
4. Use refresh tokens.
5. Never store secrets in React code.
6. Never commit secrets to Git.
7. Sanitize user-generated content.
8. Protect against XSS attacks.
9. Validate permissions on the backend.
10. Treat the frontend as untrusted.

## Final Thoughts

Authentication verifies identity.

Authorization controls permissions.

JWT tokens allow stateless authentication and are widely used in modern React applications.

For token storage:

| Choice | Recommendation |
|----------|---------------|
| localStorage | Acceptable for many apps |
| HttpOnly Cookies | Preferred for production |

For secrets:

- Frontend cannot securely store secrets.
- Real secrets belong on backend servers.
- Use dedicated secret management solutions.
- Never commit secrets into source control.

The most important security principle to remember is simple:

**If it runs in the browser, assume users can see it.**
`,
};
