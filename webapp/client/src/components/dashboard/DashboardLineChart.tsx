import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DashboardCardData } from "../../hooks/useDashboardCardDataset";
import { generateColorPallete } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardLineChartProps {
  data: DashboardCardData;
}

// example data format
const DashboardLineChart = (props: DashboardLineChartProps) => {
  const data = {
    labels: props.data.labels.map((label) => label.split(" ")[0]),
    datasets: props.data.datasets.map((dataset) => {
      return {
        label: dataset.label,
        data: dataset.data,
        fill: false,
        generateColorPallete: generateColorPallete(props.data.labels.length),
        borderColor: generateColorPallete(props.data.datasets.length),
        tension: 0.1,
      };
    }),
  };

  return (
    <>
      <div className="">
        <Line
          height={280}
          width={380}
          data={data}
          options={{
            scales: {
              y: {
                title: {
                  display: true,
                  text: props.data.unit,
                },
              },
              x: {
                display: false,
              },
            },
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false, position: "top", align: "center" },
            },
          }}
        />
      </div>
    </>
  );
};

export default DashboardLineChart;
