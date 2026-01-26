import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const getAuthMethods = async () => {
  // We need to pass the headers from better-auth somehow if not using cookies,
  // but better-auth usually uses cookies.
  // If we are server-side or client-side...
  // Client side fetch should handle cookies if credentials: include is returned or default.
  // But axios/fetch needs explicitly `credentials: 'include'`.

  // Using `authClient` fetch wrapper if available?
  // `better-auth` client doesn't expose a generic fetcher easily in all versions.
  // Let's use native fetch with credentials.

  const response = await fetch(
    "http://localhost:3000/api/users/me/auth-methods",
    {
      headers: {
        "Content-Type": "application/json",
        // If we need to pass a session token manually, we'd grab it from `authClient.useSession` or storage.
        // But for now assuming cookies work or we can get session from storage.
        // Better-Auth typically puts token in localStorage "better-auth.session_token" or similar, OR HttpOnly cookie.
        // If HttpOnly cookie, `credentials: 'include'` is key.
      },
      // IMPORTANT: better-auth usually uses cookies.
      // We must ensure credentials are sent.
      // However, if we are on localhost:5173 calling localhost:3000, we need CORS + credentials.
      // better-auth handles this for its own routes.
      // For our route, we must ensure fetch sends cookies.
      // Note: fetch defaults to 'same-origin'.
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch auth methods");
  }

  return response.json();
};
