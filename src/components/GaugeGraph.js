import React, { useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./GaugeGraph.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GaugeGraph({
  latest,
  metric,
  label,
  unit = "",
  min = 0,
  max = 100,
  thresholds = [],
}) {
  const chartRef = useRef(null);
  const rawValue = latest?.metrics?.[metric];

  const value = useMemo(() => {
    if (typeof rawValue !== "number" || Number.isNaN(rawValue)) return null;
    return Math.max(min, Math.min(max, rawValue));
  }, [rawValue, min, max]);

  const fraction = useMemo(() => {
    if (value == null || max === min) return 0;
    return (value - min) / (max - min);
  }, [value, min, max]);

  const backgroundData = useMemo(() => {
    if (!thresholds.length) {
      return {
        data: [1],
        backgroundColor: ["rgba(100, 100, 100, 0.2)"],
      };
    }

    const data = [];
    const colors = [];

    thresholds.forEach((t) => {
      const from = Math.max(min, t.from);
      const to = Math.min(max, t.to);
      if (to <= from) return;

      const segmentFraction = (to - from) / (max - min);
      data.push(segmentFraction);
      colors.push(t.color);
    });

    return { data, backgroundColor: colors };
  }, [thresholds, min, max]);

  // Value arc
  const valueData = useMemo(
    () => ({
      data: [fraction, 1 - fraction],
      backgroundColor: [
        "rgba(255, 255, 255, 0.9)",
        "rgba(0, 0, 0, 0)",
      ],
      borderWidth: 0,
      circumference: 180,
    }),
    [fraction]
  );

  const data = {
    labels: [],
    datasets: [
      {
        id: "bands",
        ...backgroundData,
        borderWidth: 0,
        circumference: 180,
        weight: 1,
      },
      {
        id: "value",
        ...valueData,
        weight: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: "70%",
    animation: {
      duration: 400,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: () =>
            `${label || metric}: ${
              typeof rawValue === "number"
                ? rawValue.toFixed(1) + (unit ? ` ${unit}` : "")
                : rawValue ?? "N/A"
            }`,
        },
      },
    },
  };

  const displayValue =
    typeof rawValue === "number"
      ? `${rawValue.toFixed(1)}${unit ? ` ${unit}` : ""}`
      : rawValue ?? "—";

  return (
    <div className={styles.root}>
      <div className={styles.title}>{label || metric}</div>
      <div className={styles.chartWrapper}>
        <Doughnut
          ref={chartRef}
          data={data}
          options={options}
          datasetIdKey="id"
        />
        <div className={styles.center}>
          <span
            className={
              value == null ? styles.valueTextDisabled : styles.valueText
            }
          >
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
}
