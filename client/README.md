# Note App Client

The client is a React application built with Vite. It provides registration,
email verification, login, password recovery, and a server-backed home page.

## Requirements

- Node.js
- The Note App server running locally or at the URL configured in
  `VITE_API_BASE_URL`

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start the development server:

```bash
npm run dev
```

Build the client for production:

```bash
npm run build
```

## Authentication flow

1. The user logs in through `/login`.
2. The client stores the access token returned by the server.
3. When `/home` loads, it calls `GET /users/me` with the token:

   ```http
   Authorization: Bearer <access-token>
   ```

4. The server returns the authenticated user's safe profile details, such as
   `username` and `email`.
5. If the token is missing or expired, the client clears it and redirects to
   `/login`.

Passwords, OTP values, and server tokens are not displayed on the home page.

## Password recovery

The password recovery flow is:

1. Request an OTP with the registered email.
2. Verify the OTP.
3. Set a new password with the matching confirmation password.

The client only redirects to the reset-password page after successful OTP
verification. Invalid or expired OTPs remain on the verification screen and
show an error message.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
