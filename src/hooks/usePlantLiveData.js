import { useEffect, useState, useRef } from "react";
import { API } from "../config/api";

const CACHE_DEVICE_IDS = [
  "plant_1_reactor_temp_node_1",
  "plant_1_buffer_node_1",
  "plant_1_heat_output_node_1",
  "plant_1_exhaust_node_1",
];

function mergeCachedReadings(cachedByDevice) {
  const byTs = new Map();

  for (const { device_id, readings } of cachedByDevice) {
    console.log(`[merge] merging ${readings.length} readings for ${device_id}`);

    for (const r of readings) {
      const key = r.ts;
      const existing = byTs.get(key) || {
        ts: r.ts,
        metrics: {},
        device_ids: [],
      };

      existing.metrics = { ...existing.metrics, ...(r.metrics || {}) };
      if (!existing.device_ids.includes(device_id)) {
        existing.device_ids.push(device_id);
      }

      byTs.set(key, existing);
    }
  }

  const arr = Array.from(byTs.values());
  arr.sort((a, b) => new Date(a.ts) - new Date(b.ts));

  console.log("[merge] final merged array:", arr.length);

  return arr;
}

export function usePlantLiveData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const httpBase =
      API && API.length
        ? API
        : `${window.location.protocol}//${window.location.host}`;

    console.log("[usePlantLiveData] httpBase =", httpBase);

    let cancelled = false;

    // Load cache from backend
    async function loadCache() {

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("[usePlantLiveData] No JWT token found → can't load cache");
          return;
        }

        const results = [];

        for (const device_id of CACHE_DEVICE_IDS) {
          console.log(
            `[usePlantLiveData] FETCHING CACHE for device_id=${device_id}`
          );

          const url = `${httpBase}/recent/${device_id}`;

          let res;
          try {
            res = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (networkErr) {
            console.error(
              `[usePlantLiveData] Network error while fetching ${device_id}:`,
              networkErr
            );
            continue;
          }

          if (!res.ok) {
            console.warn(
              `[usePlantLiveData]  Failed to load cache for ${device_id} → status ${res.status}`
            );
            continue;
          }

          const json = await res.json();

          const data = json.data || json;

          results.push({
            device_id: data.device_id || device_id,
            readings: data.readings || [],
          });
        }

        if (!cancelled) {
          const merged = mergeCachedReadings(results);

          setHistory(merged);

          if (merged.length > 0) {
            setLatest(merged[merged.length - 1]);
          }
        }
      } catch (err) {
        console.error("[usePlantLiveData] Cache load error:", err);
      }
    }

    loadCache();

    // WebSocket for live data
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (_) {}
    }

    const wsBase = httpBase.replace(/^http/i, "ws");
    const wsUrl = `${wsBase}/ws/plant`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] Connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "plant-reading") {

          setLatest((prev) => {
            const merged = {
              ...(prev || {}),
              ...msg,
              metrics: {
                ...(prev?.metrics || {}),
                ...(msg.metrics || {}),
              },
            };

            setHistory((prevHistory) =>
              [...prevHistory, merged].slice(-2000)
            );

            return merged;
          });
        }
      } catch (err) {
        console.error("[WS] Error parsing WS message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("[WS] Disconnected");
    };

    return () => {
      cancelled = true;
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (_) {}
        wsRef.current = null;
      }
    };
  }, []);

  return { latest, history };
}
