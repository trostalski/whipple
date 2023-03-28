import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { DashboardCardData } from "../../hooks/useDashboardCardDataset";
import { generateColorPallete, isNonEmptyObject } from "./utils";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { isObject } from "vis-util/esnext";

ChartJS.register(ArcElement, Tooltip, Legend, BoxPlotController, BoxAndWiskers);

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
  console.log(props.data.unit);
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
