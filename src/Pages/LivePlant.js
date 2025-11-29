// src/Pages/LivePlant.js
import React from "react";
import { usePlantLiveData } from "../hooks/usePlantLiveData";

const fmt = (v, digits = 1) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return Number(v).toFixed(digits);
};

const LivePlant = () => {
  const { latest } = usePlantLiveData();

  if (!latest) {
    return <div>Waiting for live plant data...</div>;
  }

  const { ts, metrics = {}, deviceId, nodeId } = latest;

  return (
    <div>
      <h2>Live Plant Simulator</h2>

      <p>
        <strong>Device:</strong> {deviceId}
      </p>
      <p>
        <strong>Last update:</strong> {ts}
      </p>
      {nodeId && (
        <p>
          <strong>Last node:</strong> {nodeId}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {/* Reactor temps */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Reactor Temps</h3>
          <div>T1: {fmt(metrics.temp_T1)} °C</div>
          <div>T2: {fmt(metrics.temp_T2)} °C</div>
          <div>T3: {fmt(metrics.temp_T3)} °C</div>
          <div>T4: {fmt(metrics.temp_T4)} °C</div>
          <div>T5: {fmt(metrics.temp_T5)} °C</div>
        </div>

        {/* heat output */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Heat Output</h3>
          <div>Flow rate: {fmt(metrics.flow_rate, 2)} m³/h</div>
          <div>Fore: {fmt(metrics.fore_flow_temp)} °C</div>
          <div>Return: {fmt(metrics.return_flow_temp)} °C</div>
          <div>ΔT: {fmt(metrics.delta_t, 2)} °C</div>
          <div>Heat output: {fmt(metrics.heat_output)} kW</div>
        </div>

        {/* gas */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Exhaust Gas</h3>
          <div>Gas temp: {fmt(metrics.gas_temp)} °C</div>
          <div>Fan speed: {fmt(metrics.fan_speed, 1)}</div>
          <div>O₂: {fmt(metrics.o2_percent, 2)} %</div>
          <div>Gas pressure: {fmt(metrics.gas_pressure, 2)} µbar</div>
        </div>

        {/* Buffer */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Buffer Tank</h3>
          <div>Lower: {fmt(metrics.buffer_lower_temp)} °C</div>
          <div>Upper: {fmt(metrics.buffer_upper_temp)} °C</div>
        </div>
      </div>
    </div>
  );
};

export default LivePlant;
