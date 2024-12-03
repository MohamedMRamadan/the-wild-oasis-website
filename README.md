<div align="center">
  <br/>
  <br/>
  <img src="/public/logo.png" alt="logo" width="200" height="auto" />
  <h1>The Wild Oasis</h1>
  <br/>
  <p>
    Next.js 14 application with App Router and Server Actions allowing users to book cabins at the Wild Oasis hotel.  
    Users can navigate different cabins, sign up with Google and create an account.  
    Logged-in users can securely book cabins using Stripe for payment.  
    Responsive-design, Tailwind.css.  
    Optimistic UI.
  </p>
<p>
  <a href="https://github.com/MohamedMRamadan/the-wild-oasis-website/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/MohamedMRamadan/the-wild-oasis-website" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/MohamedMRamadan/the-wild-oasis-website" alt="last update" />
  </a>
  <a href="https://github.com/MohamedMRamadan/the-wild-oasis-website/network/members">
    <img src="https://img.shields.io/github/forks/MohamedMRamadan/the-wild-oasis-website" alt="forks" />
  </a>
  <a href="https://github.com/MohamedMRamadan/the-wild-oasis-website/stargazers">
    <img src="https://img.shields.io/github/stars/MohamedMRamadan/the-wild-oasis-website" alt="stars" />
  </a>
  <a href="https://github.com/MohamedMRamadan/the-wild-oasis-website/issues/">
    <img src="https://img.shields.io/github/issues/MohamedMRamadan/the-wild-oasis-website" alt="open issues" />
  </a>
  <a href="https://github.com/MohamedMRamadan/the-wild-oasis-website/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/MohamedMRamadan/the-wild-oasis-website.svg" alt="license" />
  </a>
</p>
</div>

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Building for Production](#building-for-production)
- [Running the Production Server](#running-the-production-server)
- [Technologies Used](#technologies-used)
- [Stripe Webhook](#stripe-webhook)
- [Live Demo](#live-demo) 🚀

# Prerequisites
- Google Cloud Account: Required to set up Next-auth Google Provider
- Supabase Account: Required for database functionalities.
- Stripe Account: Required for payment processing functionalities.

# Installation
Installation

1. Clone the repository:
```bash
git clone git@github.com:MohamedMRamadan/the-wild-oasis-website.git
cd the-wild-oasis-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a .env file in the root directory and add the following environment variables

    NEXT_PUBLIC_URL=
    
    # Supabase
    SUPABASE_URL=
    SUPABASE_API_KEY=
    
    # Next Auth & Google Provider
    NEXTAUTH_URL=
    NEXTAUTH_SECRET=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    
    # Stripe keys
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    

# Running the Development Server
To start the development server, run:

```bash
npm run dev
  ```

# Building for Production
To build the project for production, run:

```bash
npm run build
```

# Running the Production Server
After building the project, you can start the production server with:

```bash
npm start
```

# Technologies Used

## Frontend:
- **Framework**: React, Next.js 14 (App Router)
- **React Hook Form**, **Zod** (for client-side validation)
- **React Select** (for forms customization)
- **Styling**: Tailwind CSS, responsive design

## Backend:
- **DB**: SupaBase
- **Authentication**: NextAuth.js with Google Provider

## Payment Processing & Payment Refund:
- **Stripe**

# Stripe Webhook
Note - when a user initiates a payment, a non-confirmed booking is created in the database.
Configure the Stripe webhook to listen for `checkout.session.completed` events. 
After checkout, the webhook will update the corresponding booking:
- Set `is_paid` to true.
- Set `stripe_intent_id` to the value retrieved from the Stripe event.
The `stripe_intent_id` will allow Stripe to retrieve a payment and to proceed to refund on user's request.

## Live Demo
Visit the live demo of [The Wild Oasis](https://the-wild-oasis-eg.vercel.app/) deployed on Vercel.
