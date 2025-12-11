// src/services/plantHistoryService.js
import { API } from "../config/api";

export async function fetchPlantHistory({ from, to, limit } = {}) {
  const httpBase =
    API && API.length
      ? API
      : `${window.location.protocol}//${window.location.host}`;

  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("[fetchPlantHistory] No JWT token found → cannot load history");
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams();

  if (limit != null) params.set("limit", String(limit));
  if (from) {
    params.set(
      "from",
      from instanceof Date ? from.toISOString() : String(from)
    );
  }
  if (to) {
    params.set("to", to instanceof Date ? to.toISOString() : String(to));
  }

  const url =
    params.toString().length > 0
      ? `${httpBase}/plant/history?${params.toString()}`
      : `${httpBase}/plant/history`;

  console.log("[fetchPlantHistory] GET", url);

  let res;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (networkErr) {
    console.error("[fetchPlantHistory] Network error:", networkErr);
    throw new Error("Network error while fetching history");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.warn(
      `[fetchPlantHistory] Failed → status ${res.status} body=${text}`
    );
    throw new Error(text || `Failed to fetch history (status ${res.status})`);
  }

  const json = await res.json();
  // 🔑 Unwrap { success, data: { data: [...] } }
  if (Array.isArray(json?.data?.data)) {
    return json.data.data;
  }
  // fallback for other shapes just in case
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;

  console.warn("[fetchPlantHistory] Unexpected response shape:", json);
  return [];
}
