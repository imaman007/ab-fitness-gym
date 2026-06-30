# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please follow responsible disclosure:

1. **Do NOT open a public GitHub issue** for security vulnerabilities.
2. Email the maintainer directly at your-email@example.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

We will respond within 48 hours and work to resolve it promptly.

## What We Protect Against

- SQL Injection (Prisma ORM with parameterized queries)
- XSS (Next.js escapes output by default)
- CSRF (NextAuth handles session tokens securely)
- Secret leakage (`.env` files are gitignored — never committed)

## Environment Variables Security

- **Never commit** `.env` or `.env.local` to version control
- Use `.env.example` as a template (no real values)
- Rotate your `NEXTAUTH_SECRET` and Razorpay keys regularly
- Use environment variable managers (Vercel, Railway, etc.) for production
