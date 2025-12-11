import React from "react";
import { usePlantLiveData } from "../hooks/usePlantLiveData";
import GaugeGraph from "../components/GaugeGraph.js";
import styles from "./LivePlant.module.css";
import ScreenHeader from "../components/ScreenHeader.js";

const fmt = (v, digits = 1) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return Number(v).toFixed(digits);
};

const LivePlant = () => {
  const { latest } = usePlantLiveData();

  if (!latest) {
    return <div className={styles.loading}>Waiting for data...</div>;
  }

  const { ts, metrics = {}, device_id, nodeId } = latest;

  // If ts is a Date or ISO string, this turns it into a nice string WITHOUT any "@"
  const formattedTs = ts ? String(ts) : "—";

  return (
    <div className={styles.root}>
    <ScreenHeader name="Live Plant Simulator"/>

      <div className={styles.metaRow}>
        <div>
          <strong>Device:</strong> {device_id || "—"}
        </div>
        <div>
          <strong>Last reading:</strong>{" "}
          <span className={styles.timestamp}>{formattedTs}</span>
        </div>
        {nodeId && (
          <div>
            <strong>Last node:</strong> {nodeId}
          </div>
        )}
      </div>

      {/* Reactor temps – gauges only */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Reactor Temperatures</h3>
        <div className={styles.gaugeGrid}>
          <GaugeGraph
            latest={latest}
            metric="temp_T1"
            label="T1"
            unit="°C"
            min={600}
            max={900}
            thresholds={[
              { from: 600, to: 700, color: "rgba(241,196,15,0.5)" },
              { from: 700, to: 800, color: "rgba(46,204,113,0.5)" },
              { from: 800, to: 900, color: "rgba(231,76,60,0.6)" },
            ]}
          />
          <GaugeGraph
            latest={latest}
            metric="temp_T2"
            label="T2"
            unit="°C"
            min={600}
            max={900}
            thresholds={[
              { from: 600, to: 700, color: "rgba(241,196,15,0.5)" },
              { from: 700, to: 800, color: "rgba(46,204,113,0.5)" },
              { from: 800, to: 900, color: "rgba(231,76,60,0.6)" },
            ]}
          />
          <GaugeGraph
            latest={latest}
            metric="temp_T3"
            label="T3"
            unit="°C"
            min={600}
            max={900}
            thresholds={[
              { from: 600, to: 700, color: "rgba(241,196,15,0.5)" },
              { from: 700, to: 800, color: "rgba(46,204,113,0.5)" },
              { from: 800, to: 900, color: "rgba(231,76,60,0.6)" },
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
      </section>

      {/* Buffer tank – gauges only */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Buffer Tank</h3>
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
      </section>

      {/* Heating loop – gauges only */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Heating Loop</h3>
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
      </section>

      {/* Flow & exhaust – gauges only */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Flow &amp; Exhaust</h3>
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
