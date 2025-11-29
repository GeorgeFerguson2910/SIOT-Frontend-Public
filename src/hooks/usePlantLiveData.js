import { useEffect, useState, useRef } from "react";
import { API } from "../config/api"; // api helper

export function usePlantLiveData() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

    useEffect(() => {
    const httpBase = API && API.length
        ? API
        : `${window.location.protocol}//${window.location.host}`;

    const wsBase = httpBase.replace(/^http/i, "ws");
    const wsUrl = `${wsBase}/ws/plant`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
        console.log("[WS] Connected to", wsUrl);
    };

    ws.onmessage = (event) => {
        try {
        const msg = JSON.parse(event.data);
        if (msg.type === "plant-reading") {
            setLatest(msg);
            setHistory((prev) => [...prev.slice(-199), msg]);
        }
        } catch (e) {
        console.error("[WS] Bad message", e);
        }
    };

    ws.onerror = (err) => {
        console.error("[WS] Error:", err);
    };

    ws.onclose = () => {
        console.log("[WS] Disconnected");
    };

    return () => {
        ws.close();
    };
    }, []);

  return { latest, history };
}
