# Quickly Code Challenge

A Next.js application built as part of the Quickly Code Challenge.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Shadcn UI
- React Hook Form with Zod validation
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Configuration

To use a different API endpoint:

1. Create a `.env.local` file in the root directory
2. Add the following environment variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

By default, the application uses `https://api-dev.quicklyinc.com` as the API endpoint.


## Pages

### Login (/login)

- Email and password form with validation
- Error handling
- Redirect to profile on successful login

### Profile (/profile)

- Displays user information
- Company details
- Payment Date Checker component
- Protected route (redirects to login if not authenticated)

## Payment Date Checker

A component that calculates when an invoice will be paid based on:

- Invoice due date
- Monthly payment cycle date

Example: If an invoice is due on April 15th and the payment cycle is on the 30th of each month, the invoice will be paid on April 30th.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
