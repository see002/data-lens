This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses TailwindCSS and React Query.

## Project Scripts

- `pnpm precheck`: runs lint, type-check, and tests
- `pnpm build`: builds the production bundle
- `pnpm start`: starts the production server
- `pnpm format`: checks formatting
- `pnpm format:write`: formats files
- `pnpm lint`: runs ESLint
- `pnpm type-check`: runs TypeScript type checks

## Pre-commit

Husky and lint-staged run ESLint and Prettier on staged files and run TypeScript type-checks before commit.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in required values. Public variables must be prefixed with `NEXT_PUBLIC_`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Connect this repository to Vercel and deploy. The project is configured for `reactStrictMode`, SWC minification, and standard security headers. No custom build settings are required.
