import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DashboardCardData } from "../../hooks/useDashboardCardDataset";
import { generateColorPallete } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardBarChartProps {
  data: DashboardCardData;
}

// example data format
const DashboardBarChart = (props: DashboardBarChartProps) => {
  const [data, setData] = useState(props.data);
  const [dataRange, setDataRange] = React.useState<number>(50);

  useEffect(() => {
    const labels = props.data.labels.filter((_, i) => i < dataRange);
    const data = props.data.datasets[0].data.filter((_, i) => i < dataRange).sort((a, b) => b-a);
    const colors = generateColorPallete(labels.length);
    setData({
      labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          label: props.data.datasets[0].label,
        },
      ],
    });
  }, [dataRange]);
  console.log(data);
  return (
    <>
      <div className="">
        <Bar
          height={280}
          width={380}
          data={data}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false,
              },
            },
            plugins: {
              legend: { display: false, position: "top", align: "center" },
            },
          }}
        />
      </div>
      <input
        type="range"
        min="1"
        max="100"
        className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        value={dataRange}
        onChange={(e) => {
          setDataRange(Number(e.target.value));
        }}
      />
      <p>{dataRange}</p>
    </>
  );
};

export default DashboardBarChart;
