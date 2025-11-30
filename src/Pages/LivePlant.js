import React from "react";
import { usePlantLiveData } from "../hooks/usePlantLiveData";
import GaugeGraph from "../components/GaugeGraph.js";
import MultiMetricLineChart from "../components/MultiMetricChart";
import styles from "./LivePlant.module.css";

const fmt = (v, digits = 1) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return Number(v).toFixed(digits);
};

const LivePlant = () => {
  const { latest, history } = usePlantLiveData();

  if (!latest) {
    return <div className={styles.loading}>Waiting for live plant data...</div>;
  }

  const { ts, metrics = {}, device_id, nodeId } = latest;

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Live Plant Simulator</h2>

      <div className={styles.metaRow}>
        <div>
          <strong>Device:</strong> {device_id || "—"}
        </div>
        <div>
          <strong>Last update:</strong> {ts}
        </div>
        {nodeId && (
          <div>
            <strong>Last node:</strong> {nodeId}
          </div>
        )}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Reactor Temperatures</h3>
        <div className={styles.sectionGrid}>
          <MultiMetricLineChart
            history={history}
            title="Reactor Temps T1–T5"
            unit="°C"
            yMin={400}
            yMax={800}
            metrics={[
              { key: "temp_T1", label: "T1" },
              { key: "temp_T2", label: "T2" },
              { key: "temp_T3", label: "T3" },
              { key: "temp_T4", label: "T4" },
              { key: "temp_T5", label: "T5" },
            ]}
          />
          <div className={styles.gaugeGrid}>
            <GaugeGraph
              latest={latest}
              metric="temp_T1"
              label="T1"
              unit="°C"
              min={400}
              max={800}
              thresholds={[
                { from: 400, to: 520, color: "rgba(241,196,15,0.5)" },
                { from: 520, to: 650, color: "rgba(46,204,113,0.5)" },
                { from: 650, to: 800, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="temp_T2"
              label="T2"
              unit="°C"
              min={400}
              max={800}
              thresholds={[
                { from: 400, to: 520, color: "rgba(241,196,15,0.5)" },
                { from: 520, to: 650, color: "rgba(46,204,113,0.5)" },
                { from: 650, to: 800, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="temp_T3"
              label="T3"
              unit="°C"
              min={400}
              max={800}
              thresholds={[
                { from: 400, to: 520, color: "rgba(241,196,15,0.5)" },
                { from: 520, to: 650, color: "rgba(46,204,113,0.5)" },
                { from: 650, to: 800, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="temp_T4"
              label="T4"
              unit="°C"
              min={400}
              max={800}
              thresholds={[
                { from: 400, to: 520, color: "rgba(241,196,15,0.5)" },
                { from: 520, to: 650, color: "rgba(46,204,113,0.5)" },
                { from: 650, to: 800, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="temp_T5"
              label="T5"
              unit="°C"
              min={400}
              max={800}
              thresholds={[
                { from: 400, to: 520, color: "rgba(241,196,15,0.5)" },
                { from: 520, to: 650, color: "rgba(46,204,113,0.5)" },
                { from: 650, to: 800, color: "rgba(231,76,60,0.6)" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Buffer Tank</h3>
        <div className={styles.sectionGrid}>
          <MultiMetricLineChart
            history={history}
            title="Buffer Temps"
            unit="°C"
            metrics={[
              { key: "buffer_lower_temp", label: "Lower" },
              { key: "buffer_upper_temp", label: "Upper" },
            ]}
          />
          <div className={styles.gaugeGrid}>
            <GaugeGraph
              latest={latest}
              metric="buffer_lower_temp"
              label="Buffer Lower"
              unit="°C"
              min={40}
              max={90}
              thresholds={[
                { from: 40, to: 60, color: "rgba(241,196,15,0.5)" },
                { from: 60, to: 80, color: "rgba(46,204,113,0.5)" },
                { from: 80, to: 90, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="buffer_upper_temp"
              label="Buffer Upper"
              unit="°C"
              min={40}
              max={90}
              thresholds={[
                { from: 40, to: 60, color: "rgba(241,196,15,0.5)" },
                { from: 60, to: 80, color: "rgba(46,204,113,0.5)" },
                { from: 80, to: 90, color: "rgba(231,76,60,0.6)" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Heating Loop</h3>
        <div className={styles.sectionGrid}>
          <MultiMetricLineChart
            history={history}
            title="Flow & Return Temps"
            unit="°C"
            metrics={[
              { key: "fore_flow_temp", label: "Flow" },
              { key: "return_flow_temp", label: "Return" },
            ]}
          />
          <div className={styles.gaugeGrid}>
            <GaugeGraph
              latest={latest}
              metric="fore_flow_temp"
              label="Flow Temp"
              unit="°C"
              min={40}
              max={90}
              thresholds={[
                { from: 40, to: 60, color: "rgba(241,196,15,0.5)" },
                { from: 60, to: 80, color: "rgba(46,204,113,0.5)" },
                { from: 80, to: 90, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="return_flow_temp"
              label="Return Temp"
              unit="°C"
              min={40}
              max={90}
              thresholds={[
                { from: 40, to: 60, color: "rgba(241,196,15,0.5)" },
                { from: 60, to: 80, color: "rgba(46,204,113,0.5)" },
                { from: 80, to: 90, color: "rgba(231,76,60,0.6)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="delta_t"
              label="ΔT"
              unit="°C"
              min={0}
              max={30}
              thresholds={[
                { from: 0, to: 5, color: "rgba(231,76,60,0.6)" },
                { from: 5, to: 15, color: "rgba(46,204,113,0.5)" },
                { from: 15, to: 30, color: "rgba(241,196,15,0.5)" },
              ]}
            />
            <GaugeGraph
              latest={latest}
              metric="heat_output"
              label="Heat Output"
              unit="kW"
              min={0}
              max={1000}
              thresholds={[
                { from: 0, to: 200, color: "rgba(241,196,15,0.5)" },
                { from: 200, to: 800, color: "rgba(46,204,113,0.5)" },
                { from: 800, to: 1000, color: "rgba(231,76,60,0.6)" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Flow & Exhaust</h3>
        <div className={styles.gaugeGrid}>
          <GaugeGraph
            latest={latest}
            metric="flow_rate"
            label="Flow Rate"
            unit="L/s"
            min={0}
            max={25}
            thresholds={[
              { from: 0, to: 5, color: "rgba(231,76,60,0.6)" },
              { from: 5, to: 20, color: "rgba(46,204,113,0.5)" },
              { from: 20, to: 25, color: "rgba(241,196,15,0.5)" },
            ]}
          />
          <GaugeGraph
            latest={latest}
            metric="gas_temp"
            label="Exhaust Temp"
            unit="°C"
            min={50}
            max={200}
            thresholds={[
              { from: 50, to: 100, color: "rgba(46,204,113,0.5)" },
              { from: 100, to: 150, color: "rgba(241,196,15,0.5)" },
              { from: 150, to: 200, color: "rgba(231,76,60,0.6)" },
            ]}
          />
          <GaugeGraph
            latest={latest}
            metric="gas_pressure"
            label="Gas Pressure"
            unit="mbar"
            min={-5}
            max={1}
            thresholds={[
              { from: -5, to: -3, color: "rgba(231,76,60,0.6)" },
              { from: -3, to: -1, color: "rgba(46,204,113,0.5)" },
              { from: -1, to: 1, color: "rgba(241,196,15,0.5)" },
            ]}
          />
          <GaugeGraph
            latest={latest}
            metric="fan_speed"
            label="Fan Speed"
            unit="%"
            min={0}
            max={100}
            thresholds={[
              { from: 0, to: 20, color: "rgba(241,196,15,0.5)" },
              { from: 20, to: 80, color: "rgba(46,204,113,0.5)" },
              { from: 80, to: 100, color: "rgba(231,76,60,0.6)" },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default LivePlant;
