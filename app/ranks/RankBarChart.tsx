"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RankBarChart({
  labels,
  data,
}: {
  labels: string[];
  data: number[];
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "本周平均成绩",
        data,
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, suggestedMax: 100 },
    },
  };

  return <Bar data={chartData} options={options} />;
}
