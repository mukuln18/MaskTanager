/**
 * Central API fetch wrapper.
 * Always sends cookies (credentials: 'include') so the httpOnly JWT token
 * is forwarded to the Next.js API routes.
 */

const BASE_URL = "/api";

async function request(method, path, data) {
  const options = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const json = await res.json();

  if (!res.ok || !json.success) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("taskmanager_user");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          window.location.href = "/login";
        }
      }
    }
    const error = new Error(json.message || "Something went wrong");
    error.status = res.status;
    error.data = json;
    throw error;
  }

  return json;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, data) => request("POST", path, data),
  put: (path, data) => request("PUT", path, data),
  delete: (path) => request("DELETE", path),
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (data) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const projectsApi = {
  list: () => api.get("/projects"),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, userId) =>
    api.post(`/projects/${projectId}/members`, { userId }),
  removeMember: (projectId, userId) =>
    request("DELETE", `/projects/${projectId}/members?userId=${userId}`),
};

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasksApi = {
  list: (projectId) =>
    api.get(projectId ? `/tasks?projectId=${projectId}` : "/tasks"),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  assign: (id, assignedTo) => api.put(`/tasks/${id}/assign`, { assignedTo }),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
  list: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};
