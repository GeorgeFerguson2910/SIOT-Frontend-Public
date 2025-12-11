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

const GAUGE_CIRC = 220;              // total arc in degrees
const GAUGE_ROT = -GAUGE_CIRC / 2;   // center it horizontally

// Make a color more vibrant (works with rgb(), rgba(), and hex)
function boostColor(color, boost = 1.4) {
  try {
    if (!color || typeof color !== "string") return color;

    // Handle rgb()/rgba()
    if (color.startsWith("rgb")) {
      const match = color.match(
        /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i
      );
      if (!match) return color;

      let r = parseInt(match[1], 10);
      let g = parseInt(match[2], 10);
      let b = parseInt(match[3], 10);
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

      r = Math.min(255, Math.floor(r * boost));
      g = Math.min(255, Math.floor(g * boost));
      b = Math.min(255, Math.floor(b * boost));

      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Handle hex (#rgb or #rrggbb)
    let c = color.replace("#", "");

    if (c.length === 3) {
      c = c
        .split("")
        .map((x) => x + x)
        .join("");
    }

    if (c.length !== 6) return color;

    let r = parseInt(c.substring(0, 2), 16);
    let g = parseInt(c.substring(2, 4), 16);
    let b = parseInt(c.substring(4, 6), 16);

    r = Math.min(255, Math.floor(r * boost));
    g = Math.min(255, Math.floor(g * boost));
    b = Math.min(255, Math.floor(b * boost));

    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return color; // fallback: just use original
  }
}

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

  // Clamp to [min, max]
  const value = useMemo(() => {
    if (typeof rawValue !== "number" || Number.isNaN(rawValue)) return null;
    return Math.max(min, Math.min(max, rawValue));
  }, [rawValue, min, max]);

  // Fraction of gauge filled
  const fraction = useMemo(() => {
    if (value == null || max === min) return 0;
    return (value - min) / (max - min);
  }, [value, min, max]);

  // Background threshold bands
  const backgroundData = useMemo(() => {
    // Single grey band if no thresholds
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
      colors.push(t.color); // your rgb/rgba colours
    });

    return { data, backgroundColor: colors };
  }, [thresholds, min, max]);

  // Foreground value arc – colour depends on active threshold, then boosted
  const valueData = useMemo(() => {
    // Default fallback
    let baseColor = "rgba(255, 255, 255, 0.9)";

    if (value != null && thresholds.length && max !== min) {
      for (const t of thresholds) {
        const from = Math.max(min, t.from);
        const to = Math.min(max, t.to);
        if (value >= from && value <= to) {
          baseColor = t.color; // same as band
          break;
        }
      }
    }

    // Boost the colour for the value arc
    const vibrantColor = boostColor(baseColor, 1.5); // 1.2–1.8 works nicely

    return {
      data: [fraction, 1 - fraction],
      backgroundColor: [
        vibrantColor,        // much more vibrant
        "rgba(0, 0, 0, 0)",  // transparent remainder
      ],
      borderWidth: 0,
    };
  }, [fraction, value, thresholds, min, max]);

  const data = {
    labels: [],
    datasets: [
      {
        id: "bands",
        ...backgroundData,
        borderWidth: 0,
        circumference: GAUGE_CIRC,
        weight: 2,
      },
      {
        id: "value",
        ...valueData,
        borderWidth: 0,
        circumference: GAUGE_CIRC,
        weight: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: GAUGE_ROT,       // center the 220° arc
    circumference: GAUGE_CIRC, // total arc
    cutout: "80%",
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
