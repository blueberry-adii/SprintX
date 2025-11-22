const API_BASE = "http://18.60.185.245:5000/api/v1";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      throw new Error("Session expired");
    }

    let errorMessage = res.statusText;
    try {
      const errorBody = await res.json();
      errorMessage =
        errorBody.error || errorBody.message || JSON.stringify(errorBody);
    } catch (e) {
      // Fallback to text if JSON parsing fails
      const text = await res.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const api = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Is backend running on port 5000?"
        );
      }
      throw error;
    }
  },

  post: async <T = any>(endpoint: string, body: any): Promise<T> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse(res);
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Is backend running on port 5000?"
        );
      }
      throw error;
    }
  },

  put: async <T = any>(endpoint: string, body: any): Promise<T> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse(res);
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Is backend running on port 5000?"
        );
      }
      throw error;
    }
  },

  patch: async <T = any>(endpoint: string, body: any): Promise<T> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse(res);
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Is backend running on port 5000?"
        );
      }
      throw error;
    }
  },

  delete: async <T = any>(endpoint: string): Promise<T> => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Is backend running on port 5000?"
        );
      }
      throw error;
    }
  },
};
