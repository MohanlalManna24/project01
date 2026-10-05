# Frontend Development Guide

This guide defines how to build the React frontend against the Note App API. It is written as the working contract between frontend and backend developers: use the request shapes, response shapes, validation rules, and UI states below rather than duplicating backend assumptions in individual components.

## 1. Application architecture

The repository contains two applications:

```text
client/   React 19 + Vite + Tailwind CSS
server/   Express API + MongoDB
```

The API mounts all user routes under `/api/users`. During local development, the API normally runs on the port configured by `server/.env` (the example configuration uses `4000`) and the Vite client normally runs on `5173`.

### Recommended client structure

Keep network concerns out of presentational components:

```text
client/src/
  api/
    client.js
    users.js
  components/
  pages/
  hooks/
  utils/
```

The current components live under `client/src/components/` and pages under
`client/src/pages/`. Each page should own its form state and rendering; the
shared Axios instance in `client/src/api/axios.js` owns the API base URL and
common request configuration.

## 2. Environment configuration

Create `client/.env` or `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

The current client uses Axios:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
```

Do not put `SECRET_KEY`, database credentials, mail credentials, or any other server secret in `client/.env*`. Only variables prefixed with `VITE_` are intended for browser code.

## 3. API contract

### Register

`POST /api/users/register`

Request:

```json
{
  "username": "mohan_24",
  "email": "mohan@example.com",
  "password": "password123"
}
```

Rules:

- `username` is required, trimmed, 3–30 characters, and may contain only letters, numbers, and underscores.
- `email` is required and must be valid.
- `password` is required and must contain at least 4 characters.

Success: `201 Created`

```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "USER_ID",
    "username": "mohan_24",
    "email": "mohan@example.com",
    "isVerified": false,
    "token": "EMAIL_VERIFICATION_TOKEN"
  }
}
```

The user must verify the email before login is allowed. The verification token expires after 10 minutes.

### Verify email

The email sent by the server contains a link to:

`GET /api/users/verify-email?token=EMAIL_VERIFICATION_TOKEN`

The route is currently registered as `POST` in Express, while the mailer generates a `GET` link. Frontend developers should treat this as a backend integration issue: do not silently show success when the link fails. The backend should align the route method and mail link before production use.

When called successfully, the API returns:

```json
{ "message": "Email verified successfully" }
```

### Login

`POST /api/users/login`

Request:

```json
{
  "email": "mohan@example.com",
  "password": "password123"
}
```

Success: `200 OK`

```json
{
  "message": "Login successful",
  "user": {
    "id": "USER_ID",
    "username": "mohan_24",
    "email": "mohan@example.com",
    "isVerified": true,
    "token": "ACCESS_TOKEN",
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

Use `accessToken` for authenticated requests:

```http
Authorization: Bearer ACCESS_TOKEN
```

The access token expires after 7 days. The refresh token expires after 15 days.
There is currently no refresh-token endpoint, so the UI should handle an
expired access token by clearing the local session and sending the user to
login. The current login screen stores the returned `accessToken` as
`localStorage.accessToken` for the protected user request.

### Get the authenticated user

`GET /api/users/me`

Headers:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

The Home page calls this endpoint after login to load the latest user details
from the server:

```json
{
  "user": {
    "_id": "USER_ID",
    "username": "mohan_24",
    "email": "mohan@example.com",
    "isVerified": true,
    "isLoggedIn": true
  }
}
```

The server excludes the password, OTP values, and private token fields. If the
token is missing, invalid, or expired, the client clears `accessToken` and
redirects to `/login`.

### Logout

`POST /api/users/logout`

Headers:

```http
Authorization: Bearer ACCESS_TOKEN
```

Success:

```json
{ "message": "Logout successful" }
```

Clear the client session after a successful response. Also clear it when the API returns `401` because the token is missing or invalid.

### Forgot password

`POST /api/users/forget-password`

Request:

```json
{ "email": "mohan@example.com" }
```

Success:

```json
{ "message": "Password reset email sent" }
```

The user must be verified before a reset email is sent. The OTP is valid for 10 minutes.

### Verify password-reset OTP

`POST /api/users/verify-otp/:email`

URL-encode the email because it is part of the path:

```js
const path = `/users/verify-otp/${encodeURIComponent(email)}`;
```

Request:

```json
{ "otp": "123456" }
```

Success:

```json
{ "message": "OTP verified successfully" }
```

### Change password

`POST /api/users/change-password/:email`

URL-encode the email. Request:

```json
{
  "newPassword": "new-password123",
  "confirmPassword": "new-password123"
}
```

Success:

```json
{ "message": "Password updated successfully" }
```

The backend currently checks that both values exist and match. The frontend
requires at least 6 characters for a reset password.

## 4. Error handling

Validation errors from registration and login use this shape:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Username is required",
      "path": "username",
      "location": "body"
    }
  ]
}
```

Other errors generally use:

```json
{ "message": "User already exists" }
```

Map errors by field when `errors` is present. Otherwise show `message` in a form-level alert. Always provide a useful fallback such as “Something went wrong. Please try again.” Do not expose stack traces or server implementation details.

Recommended form state:

```js
const [status, setStatus] = useState("idle"); // idle | submitting | success | error
const [fieldErrors, setFieldErrors] = useState({});
const [formError, setFormError] = useState("");
```

Disable the submit button while `status === "submitting"`, preserve entered values on failure, and clear only the relevant field error when that field changes.

## 5. Registration implementation pattern

The registration form should be controlled and submit JSON, not `FormData`:

```jsx
async function handleSubmit(event) {
  event.preventDefault();
  setFormError("");
  setFieldErrors({});
  setStatus("submitting");

  try {
    const response = await api.post("/users/register", formData);

    setStatus("success");
    // Navigate to a "check your email" screen. Do not log any token.
    console.info(response.data.message);
  } catch (error) {
    setStatus("error");
    if (error.details.length > 0) {
      setFieldErrors(
        Object.fromEntries(error.details.map((item) => [item.path, item.msg])),
      );
    } else {
      setFormError(error.message);
    }
  }
}
```

The current `Register` component is controlled and uses the correct field
names (`username`, `email`, and `password`). It navigates to the email
verification screen after a successful request and renders validation errors
from the API.

## 6. Authentication state and security

- Keep the authenticated user in a single auth context or hook rather than reading `localStorage` throughout the component tree.
- If browser storage is used temporarily, store only the minimum session data and never store passwords.
- Prefer secure, HTTP-only cookies for production authentication. The current API returns tokens in JSON, so token storage is a temporary client responsibility until cookie-based sessions are implemented.
- Never print access, refresh, or verification tokens to the console.
- Treat `401` as an expired or invalid session and redirect to login after clearing auth state.
- Send the access token in the `Authorization` header when calling
  protected endpoints such as `/users/me` and `/users/logout`.
- Protect authenticated routes in the UI, but remember that real authorization must be enforced by the API.

## 7. UI and accessibility standards

Every form should:

- Use a `<label>` associated with its input through `htmlFor` and `id`.
- Use `name` values matching the API fields.
- Set `type="email"` and `type="password"` where appropriate.
- Render errors in text adjacent to the invalid field.
- Use `aria-invalid` and `aria-describedby` for invalid inputs.
- Provide visible focus styles and keyboard-accessible controls.
- Show progress without removing the form context.
- Announce success and failure messages with `role="status"` or `role="alert"`.

Use Tailwind classes consistently with the existing client. Avoid adding a new UI library for isolated forms.

## 8. Local verification checklist

Before opening a pull request:

1. Start MongoDB and the server with `cd server && npm run dev`.
2. Start the client with `cd client && npm run dev`.
3. Verify registration, validation errors, email-verification feedback, login, logout, forgot-password, OTP verification, and password change.
4. After login, verify that `/users/me` loads the username and email on `/home`.
5. Confirm that requests include `Content-Type: application/json`.
6. Confirm that protected requests include an Authorization header.
7. Test server errors, duplicate email, invalid credentials, expired OTP, and repeated submissions.
8. Run:

```bash
cd client
npm run lint
npm run build
```

## 9. Backend integration items to resolve

These are important before production frontend work is considered complete:

- Add a refresh-token endpoint or explicitly adopt short-lived access tokens with a secure cookie/session strategy.
- Add a health endpoint so the frontend can distinguish an unavailable API from an invalid form submission.
- Add a contact-message API before replacing the simulated submission in `Contact.jsx`.

