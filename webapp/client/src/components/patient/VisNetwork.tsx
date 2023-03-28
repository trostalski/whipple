import React, { memo, useEffect, useState } from "react";
import { convertDataToVisNetwork, getDisplayForResource } from "./utils";
import { Network } from "vis-network/standalone";
import { ConnectionData } from "../../hooks/useConnections";
import { Dna } from "react-loader-spinner";
import { getDisplaysForResource } from "../../utils";

interface VisNetworkProps {
  connectionData: ConnectionData;
}

const VisNetwork = (props: VisNetworkProps) => {
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [displayData, setDisplayData] = useState<string | null>(null);
  const data = convertDataToVisNetwork(props.connectionData);
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
      const network = new Network(ref.current, data, {
        nodes: {
          shape: "box",
          color: {
            background: "#3B8BF6",
            border: "#000",
            highlight: {
              background: "#0066CC",
              border: "#000",
            },
          },
          font: {
            color: "#fff",
          },
        },
        edges: {
          color: {
            color: "#000",
            highlight: "#000",
          },
        },
        interaction: {
          hover: true,
        },
        layout: {
          improvedLayout: false,
          randomSeed: 191006,
        },
        physics: {
          enabled: true,
          repulsion: {},
          stabilization: {
            iterations: 400,
            updateInterval: 10,
          },
        },
      });
      // uncomment if you want to disable physics after stabilization
      network.on("stabilizationIterationsDone", function () {
        network.setOptions({ physics: false });
        setGraphLoaded(true);
      });
      network.on("click", function (properties) {
        if (properties.nodes.length > 0) {
          setSelectedItem(properties.nodes[0]);
        } else {
          setSelectedItem(null);
        }
      });
    }
  }, []);

  return (
    <>
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
      {graphLoaded ? null : (
        <div className="fixed top-1/2 left-1/2">
          <Dna visible={true} height="80" width="80" ariaLabel="dna-loading" />
        </div>
      )}
    </>
  );
};

export default memo(VisNetwork);
