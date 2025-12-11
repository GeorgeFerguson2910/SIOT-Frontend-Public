import React, { useMemo } from "react";
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
import styles from "./LineChart.module.css";

const rangeBandsPlugin = {
  id: "rangeBands",
  beforeDraw(chart, args, opts) {
    const bands = opts?.bands || [];
    if (!bands.length) return;

    const { ctx, chartArea, scales } = chart;
    const { top, bottom, left, right } = chartArea;
    const yScale = scales.y;

    ctx.save();
    bands.forEach((band) => {
      const yFrom = yScale.getPixelForValue(band.to);
      const yTo = yScale.getPixelForValue(band.from);
      ctx.fillStyle = band.color;
      ctx.fillRect(left, yFrom, right - left, yTo - yFrom);
    });
    ctx.restore();
  },
};

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  rangeBandsPlugin
);

export default function LineChart({
  history,
  metric,
  label,
  unit = "",
  yMin,
  yMax,
  bands = [],
}) {
  const data = useMemo(() => {
    const points = (history || [])
      .filter((m) => m.metrics && m.metrics[metric] != null)
      .map((m) => ({
        x: new Date(m.ts),
        y: m.metrics[metric],
      }));

    return {
      datasets: [
        {
          label: label || metric,
          data: points,
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2,
          // 👇 Force a visible line + subtle fill
          borderColor: "rgba(0, 200, 255, 1)",
          backgroundColor: "rgba(0, 200, 255, 0.15)",
        },
      ],
    };
  }, [history, metric, label]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // we'll control height via CSS
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              const vStr =
                typeof v === "number" ? v.toFixed(1) : String(v ?? "");
              return `${label || metric}: ${vStr}${unit ? ` ${unit}` : ""}`;
            },
          },
        },
        rangeBands: {
          bands,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "hour",
            displayFormats: {
              hour: "HH:mm",
            },
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "rgba(255, 255, 255, 0.8)" },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: {
            color: "rgba(255, 255, 255, 0.8)",
            callback: (v) => {
              const val = typeof v === "number" ? v.toFixed(1) : v;
              return `${val}${unit ? ` ${unit}` : ""}`;
            },
          },
        },
      },
    }),
    [bands, label, metric, unit, yMin, yMax]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>{label || metric}</div>
      <div className={styles.chartWrapper}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
