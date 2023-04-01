import React, { memo, useEffect, useState } from "react";
import { convertDataToVisTimeline } from "./utils";
import { ConnectionData } from "../../hooks/useConnections";
import { RotatingLines } from "react-loader-spinner";
import { Timeline } from "vis-timeline/standalone";
import { getDisplayForResource } from "./utils";
import "./timeline.css";

interface VisTimelineProps {
  connectionData: ConnectionData;
}

const VisTimeline = (props: VisTimelineProps) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [displayData, setDisplayData] = useState<string | null>(null);
  const data: any = convertDataToVisTimeline(props.connectionData);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItem) {
      const displayItem = props.connectionData.connections.find(
        (item) => item.id === selectedItem
      );
      const displayData = getDisplayForResource(displayItem!);
      setDisplayData(displayData!);
    } else {
      setDisplayData(null);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (ref.current) {
      const timeline = new Timeline(ref.current, data, {
        height: "100%",
        horizontalScroll: true,
        verticalScroll: true,
        moveable: true,
        zoomKey: "shiftKey",
      });
      timeline.on("click", function (properties) {
        if (properties.item) {
          setSelectedItem(properties.item);
        } else if (properties.item == null) {
          setSelectedItem(null);
        }
      });
    }
  }, []);

  return (
    <div className="relative flex w-full h-full rounded-md shadow-xl bg-white overflow-scroll">
      {displayData ? (
        <div className="absolute top-2 right-2 w-1/3 h-24 bg-blue-400 text-white border-2 rounded-xl z-50 p-2 overflow-scroll">
          <p>{displayData}</p>
        </div>
      ) : null}
      <div
        className="w-full h-full justify-center items-center"
        ref={ref}
      ></div>
    </div>
  );
};

export default memo(VisTimeline);
