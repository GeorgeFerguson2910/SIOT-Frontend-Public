import React, { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import styles from "./MultiMetricChart.module.css";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

export default function MultiMetricLineChart({
  history,
  metrics,
  title,
  unit = "",
  yMin,
  yMax,
}) {
  const chartRef = useRef(null);

  const palette = [
    "#4ade80", 
    "#60a5fa", 
    "#f97316",
    "#e879f9",
    "#facc15",
    "#22d3ee",
  ];

  const data = useMemo(() => {
    if (!history?.length || !metrics?.length) {
      return { datasets: [] };
    }

    const datasets = metrics.map((m, idx) => {
      const color = palette[idx % palette.length];

      const points = history
        .filter((msg) => msg.metrics && msg.metrics[m.key] != null)
        .map((msg) => ({
          x: new Date(msg.ts),
          y: msg.metrics[m.key],
        }));

      return {
        id: m.key,
        label: m.label || m.key,
        data: points,
        borderColor: color,
        backgroundColor: color + "33",
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.25,
      };
    });

    return { datasets };
  }, [history, metrics]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: {
        duration: 500,
        easing: "easeOutCubic",
      },
      plugins: {
        legend: {
          display: true,
          labels: { color: "rgba(255,255,255,0.8)" },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              const vStr =
                typeof v === "number" ? v.toFixed(1) : String(v ?? "");
              return `${ctx.dataset.label}: ${vStr}${
                unit ? ` ${unit}` : ""
              }`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
            displayFormats: {
              minute: "HH:mm",
              second: "HH:mm:ss",
            },
          },
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "rgba(255,255,255,0.7)" },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: {
            color: "rgba(255,255,255,0.7)",
            callback: (v) =>
              `${v}${unit ? ` ${unit}` : ""}`,
          },
        },
      },
    }),
    [unit, yMin, yMax]
  );

  return (
    <div className={styles.root}>
      {title && <div className={styles.header}>{title}</div>}
      <div className={styles.chartWrapper}>
        <Line
          ref={chartRef}
          data={data}
          options={options}
          datasetIdKey="id" 
        />
      </div>
    </div>
  );
}
