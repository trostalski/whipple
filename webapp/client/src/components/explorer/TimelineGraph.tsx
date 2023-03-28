import React, { memo, useRef } from "react";
import { getElementAtEvent, Line } from "react-chartjs-2";
import { Timepoint } from "../../types";
import "chartjs-adapter-moment";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  InteractionItem,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  TimeScale,
  zoomPlugin
);

interface TimelineGraphProps {
  timepoints: Timepoint[];
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setResourceInfoSelect: React.Dispatch<
    React.SetStateAction<InteractionItem[] | undefined>
  >;
}

const TimelineGraph = (props: TimelineGraphProps) => {
  const chartRef = useRef<any>();
  const onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    props.setResourceInfoSelect(getElementAtEvent(chartRef.current, event));
  };

  return (
    <Line
      width={500}
      height={250}
      ref={chartRef}
      data={{ datasets: [{ data: props.timepoints, pointHoverRadius: 6 }] }}
      onClick={onClick}
      options={{
        animation: false,
        showLine: false,
        scales: {
          x: {
            type: "time",
            time: { tooltipFormat: "DD.MM.YYYY" },
            title: { display: true, text: "Date" },
          },
          y: {
            type: "category",
          },
        },
        plugins: {
          legend: { display: false },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.05,
              },
              mode: "x",
              pinch: {
                enabled: true,
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                return props.timepoints[context.dataIndex].label;
              },
            },
          },
        },
      }}
    />
  );
};

export default memo(TimelineGraph);
