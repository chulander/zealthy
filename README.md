# Zealthy Fullstack Engineer

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Installation

1. **Ensure Node.js 20+ is installed.**

   - [Download Node.js](https://nodejs.org) if it’s not already installed.

2. **Clone the repository:**

   ```bash
   git@github.com:chulander/zealthy.git
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up a Turso database:**

- Sign up at Turso and create a database.
- Generate an access token for your Turso database.

5. **Create a .env file:**
   ```bash
   touch .env
   ```

- Add the following environment variables to your .env file:
  ```bash
   JWT_SECRET=
   TURSO_CONNECTION_URL=
   TURSO_AUTH_TOKEN=
  ```

6. **Run database scripts in this order:**

   ```bash
       npm run db:generate
       npm run db:migrate
       npm run db:seed // this file creates an onboarding flow
   ```

7. **Start the development server:**

   ```bash
    npm run dev
   ```

8. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**
