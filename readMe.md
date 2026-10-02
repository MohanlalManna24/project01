# Note App

A MERN application with a React/Vite client and an Express/MongoDB server. The server currently provides user registration, email verification, login, logout, and password recovery endpoints.

## Project structure

```text
client/   React frontend powered by Vite
server/   Express API and MongoDB integration
```

## Prerequisites

- Node.js 18 or newer
- A running MongoDB instance or MongoDB Atlas database

## Setup

Install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

Create `server/.env` with the values required by the API:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017
SECRET_KEY=replace-with-a-long-random-secret
MAIL_USER=your-email@example.com
MAIL_PASS=your-email-password-or-app-password
APP_URL=http://localhost:4000
```

Start the API and frontend in separate terminals:

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

The Vite development server will print its local URL, usually `http://localhost:5173`. The API runs on the port configured by `PORT`.

## API routes

All user routes are prefixed with `/api/users`:

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/register` | Register a user |
| POST | `/verify-email` | Verify an email address |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| POST | `/forget-password` | Request a password reset |
| POST | `/verify-otp/:email` | Verify a password-reset OTP |
| POST | `/change-password/:email` | Change a password |

## Available scripts

In `client/`:

```bash
npm run dev
npm run build
npm run lint
```

In `server/`:

```bash
npm run dev
npm start
```
