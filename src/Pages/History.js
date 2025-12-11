// src/pages/History.js
import React, { useEffect, useState, useCallback } from "react";
import styles from "./History.module.css";
import ScreenHeader from "../components/ScreenHeader.js";
import ModuleMain from "../components/ModuleMain.js";
import LineChart from "../components/LineChart";
import { fetchPlantHistory } from "../hooks/usePlantHistoricalData.js";

// helper to format Date → "YYYY-MM-DD"
function toDateInputValue(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Initialise defaults: last 1 day
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    setToDate(toDateInputValue(today));
    setFromDate(toDateInputValue(yesterday));
  }, []);

  const loadHistory = useCallback(
    async (opts = {}) => {
      try {
        setLoading(true);
        setError(null);

        let { from, to } = opts;

        if (!from && fromDate) {
          from = new Date(`${fromDate}T00:00:00.000Z`);
        }
        if (!to && toDate) {
          to = new Date(`${toDate}T23:59:59.999Z`);
        }

        const data = await fetchPlantHistory({
          from,
          to,
          limit: 5000,
        });

        setHistory(data);
      } catch (err) {
        setError(err.message || "Failed to load history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate]
  );

  // ❌ Remove auto-load: only load when button is clicked
  // useEffect(() => {
  //   if (fromDate && toDate) {
  //     loadHistory();
  //   }
  // }, [fromDate, toDate, loadHistory]);

  // Helper: compute yMin/yMax for a metric based on current history
const getMetricRange = (metric) => {
  const values = (history || [])
    .filter((m) => m.metrics && m.metrics[metric] != null)
    .map((m) => m.metrics[metric])
    .filter((v) => typeof v === "number" && !Number.isNaN(v));

  if (!values.length) {
    return { yMin: undefined, yMax: undefined };
  }

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const isTemperature = metric.toLowerCase().includes("temp");

  if (isTemperature) {
    // Temps: ±100°C, but bottom cannot go below 0
    return {
      yMin: Math.max(0, minVal - 100),
      yMax: maxVal + 100,
    };
  }

  // -------- Non-temperature metrics: ±20% padding (rounded to 1dp) --------
  const span = maxVal - minVal;

  if (span === 0) {
    // Flat line case
    const pad = Number((Math.abs(maxVal) * 0.2 || 1).toFixed(1));
    return {
      yMin: Number((minVal - pad).toFixed(1)),
      yMax: Number((maxVal + pad).toFixed(1)),
    };
  }

  // 20% padding, 1 decimal place
  const padding = Number((span * 0.2).toFixed(1));

  return {
    yMin: Number((minVal - padding).toFixed(1)),
    yMax: Number((maxVal + padding).toFixed(1)),
  };
};


  return (
    <div className={styles.mainWhiteContainer}>
      <ScreenHeader name="Previous History" />
      <ModuleMain>
        {/* Date Controls */}
        <div className={styles.dateControls}>
          <div className={styles.dateGroup}>
            <label>From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className={styles.dateGroup}>
            <label>To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button onClick={() => loadHistory({})}>Load data</button>

          {loading && <span className={styles.loading}>Loading…</span>}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && history.length === 0 && (
          <div className={styles.noData}>
            No readings found for this date range.
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className={styles.chartColumn}>
            {/* Reactor */}
            <section className={styles.section}>
              <h3>Reactor Temperatures</h3>
              {(() => {
                const r1 = getMetricRange("temp_T1");
                const r2 = getMetricRange("temp_T2");
                const r3 = getMetricRange("temp_T3");
                const r4 = getMetricRange("temp_T4");
                const r5 = getMetricRange("temp_T5");
                return (
                  <>
                    <LineChart
                      history={history}
                      metric="temp_T1"
                      label="Reactor T1"
                      unit="°C"
                      yMin={r1.yMin}
                      yMax={r1.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="temp_T2"
                      label="Reactor T2"
                      unit="°C"
                      yMin={r2.yMin}
                      yMax={r2.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="temp_T3"
                      label="Reactor T3"
                      unit="°C"
                      yMin={r3.yMin}
                      yMax={r3.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="temp_T4"
                      label="Reactor T4"
                      unit="°C"
                      yMin={r4.yMin}
                      yMax={r4.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="temp_T5"
                      label="Reactor T5"
                      unit="°C"
                      yMin={r5.yMin}
                      yMax={r5.yMax}
                    />
                  </>
                );
              })()}
            </section>

            {/* Buffer */}
            <section className={styles.section}>
              <h3>Buffer Tank</h3>
              {(() => {
                const lower = getMetricRange("buffer_lower_temp");
                const upper = getMetricRange("buffer_upper_temp");
                return (
                  <>
                    <LineChart
                      history={history}
                      metric="buffer_lower_temp"
                      label="Buffer Lower Temp"
                      unit="°C"
                      yMin={lower.yMin}
                      yMax={lower.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="buffer_upper_temp"
                      label="Buffer Upper Temp"
                      unit="°C"
                      yMin={upper.yMin}
                      yMax={upper.yMax}
                    />
                  </>
                );
              })()}
            </section>

            {/* Heating loop */}
            <section className={styles.section}>
              <h3>Heating Loop</h3>
              {(() => {
                const flow = getMetricRange("fore_flow_temp");
                const ret = getMetricRange("return_flow_temp");
                const dt = getMetricRange("delta_t");
                const heat = getMetricRange("heat_output");
                return (
                  <>
                    <LineChart
                      history={history}
                      metric="fore_flow_temp"
                      label="Flow Temp"
                      unit="°C"
                      yMin={flow.yMin}
                      yMax={flow.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="return_flow_temp"
                      label="Return Temp"
                      unit="°C"
                      yMin={ret.yMin}
                      yMax={ret.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="delta_t"
                      label="ΔT"
                      unit="°C"
                      yMin={dt.yMin}
                      yMax={dt.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="heat_output"
                      label="Heat Output"
                      unit="kW"
                      yMin={heat.yMin}
                      yMax={heat.yMax}
                    />
                  </>
                );
              })()}
            </section>

            {/* Flow & exhaust */}
            <section className={styles.section}>
              <h3>Flow & Exhaust</h3>
              {(() => {
                const flowRate = getMetricRange("flow_rate");
                const gasTemp = getMetricRange("gas_temp");
                const gasPressure = getMetricRange("gas_pressure");
                const fan = getMetricRange("fan_speed");
                return (
                  <>
                    <LineChart
                      history={history}
                      metric="flow_rate"
                      label="Flow Rate"
                      unit="L/s"
                      yMin={flowRate.yMin}
                      yMax={flowRate.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="gas_temp"
                      label="Exhaust Temp"
                      unit="°C"
                      yMin={gasTemp.yMin}
                      yMax={gasTemp.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="gas_pressure"
                      label="Gas Pressure"
                      unit="mbar"
                      yMin={gasPressure.yMin}
                      yMax={gasPressure.yMax}
                    />
                    <LineChart
                      history={history}
                      metric="fan_speed"
                      label="Fan Speed"
                      unit="%"
                      yMin={fan.yMin}
                      yMax={fan.yMax}
                    />
                  </>
                );
              })()}
            </section>

            {/* Combustion */}
            <section className={styles.section}>
              <h3>Combustion</h3>
              {(() => {
                const o2 = getMetricRange("o2_percent");
                return (
                  <LineChart
                    history={history}
                    metric="o2_percent"
                    label="O₂ Percent"
                    unit="%"
                    yMin={o2.yMin}
                    yMax={o2.yMax}
                  />
                );
              })()}
            </section>
          </div>
        )}
      </ModuleMain>
    </div>
  );
};

export default History;
