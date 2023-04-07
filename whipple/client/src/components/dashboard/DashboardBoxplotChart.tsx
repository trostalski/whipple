import React, { useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { DashboardCardData } from "../../hooks/useDashboardCardDataset";
import { generateColorPallete } from "./utils";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers,
  CategoryScale,
  LinearScale
);

interface DashboardBoxplotChartProps {
  data: DashboardCardData;
}

// example data format
const DashboardBoxplotChart = (props: DashboardBoxplotChartProps) => {
  const chartRef = useRef<ChartJS>(null);

  const data = props.data;
  data.datasets[0].backgroundColor = generateColorPallete(
    props.data.labels.length
  );
  return (
    <div className="">
      <Chart
        height={280}
        width={380}
        ref={chartRef}
        type="boxplot"
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              display: false,
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: props.data.unit,
              },
            },
          },
          plugins: {
            legend: { display: false, position: "top", align: "center" },
          },
        }}
      />
    </div>
  );
};

export default DashboardBoxplotChart;
