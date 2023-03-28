import React, { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DashboardCardData } from "../../hooks/useDashboardCardDataset";
import { generateColorPallete } from "./utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardPieChartProps {
  data: DashboardCardData;
}

// example data format
const DashboardPieChart = (props: DashboardPieChartProps) => {
  const [data, setData] = useState(props.data);
  const [dataRange, setDataRange] = React.useState<number>(50);

  useEffect(() => {
    const labels = props.data.labels.filter((_, i) => i < dataRange);
    const data = props.data.datasets[0].data
      .filter((_, i) => i < dataRange)
      .sort((a, b) => b - a);
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

  return (
    <>
      <div className="">
        <Pie
          height={260}
          width={260}
          data={data}
          options={{
            maintainAspectRatio: false,
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
        value={dataRange}
        className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        onChange={(e) => {
          setDataRange(Number(e.target.value));
        }}
      />
      <p>{dataRange}</p>
    </>
  );
};

export default DashboardPieChart;
