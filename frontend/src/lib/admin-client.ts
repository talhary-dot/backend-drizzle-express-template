// Helper to get headers with credentials
// Actually we rely on cookie for auth, but fetch needs credentials: include
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(
      error.message || `Request failed with status ${res.status}`,
    );
  }
  return res.json();
};

export const adminClient = {
  getStats: () => fetchWithAuth("http://localhost:3000/api/admin/stats"),
  getUsers: (page = 1, limit = 10) =>
    fetchWithAuth(
      `http://localhost:3000/api/admin/users?page=${page}&limit=${limit}`,
    ),
  updateUserRole: (userId: string, role: string) =>
    fetchWithAuth(`http://localhost:3000/api/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};
