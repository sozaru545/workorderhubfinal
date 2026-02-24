const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface ApiError {
  code: string;
  message: string;
  requestId: string;
}

async function handleResponse(response: Response) {
  let json: any;

  try {
    json = await response.json();
  } catch {
    throw {
      code: "INVALID_RESPONSE",
      message: "Server shows an invalid response",
      requestId: "N/A",
    };
  }

  if (!response.ok || !json.success) {
    throw {
      code: json?.error?.code || "UNKNOWN_ERROR",
      message: json?.error?.message || "An Unexpected error",
      requestId: json?.requestId || "N/A",
    };
  }

  return json.data;
}

async function request(url: string, options: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      "x-api-key": API_KEY || "",
      ...options.headers,
    },
  });
}

export const api = {
  createWorkOrder: async (data: any) =>
    handleResponse(
      await request("/workorders", {
        method: "POST",
        body: JSON.stringify(data),
      })
    ),

  listWorkOrders: async (query: string) =>
    handleResponse(
      await request(`/workorders?${query}`)
    ),

  getWorkOrder: async (id: string) =>
    handleResponse(
      await request(`/workorders/${id}`)
    ),

  changeStatus: async (id: string, status: string) =>
    handleResponse(
      await request(`/workorders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    ),

  bulkUploadCsv: async (formData: FormData) =>
    handleResponse(
      await request("/workorders/data-transfer", {
        method: "POST",
        body: formData,
      })
    ),
};