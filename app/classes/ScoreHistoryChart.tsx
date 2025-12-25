// app/classes/ScoreHistoryChart.tsx
"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ScoreHistoryChart({
  labels,
  noonData,
  afterData,
}: {
  labels: string[];
  noonData: (number | null)[];
  afterData: (number | null)[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "中午成绩",
        data: noonData,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: "放学后成绩",
        data: afterData,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10,
      },
    },
  } as const;

  return <Line data={data} options={options} />;
}
