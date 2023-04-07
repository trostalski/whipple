import React, { useState } from "react";
import { CytoscapeElements, CytoscapeNode, Timepoint } from "../../types";
import { InteractionItem } from "chart.js";
import TimelineGraph from "./TimelineGraph";

interface TimelineProps {
  elements: CytoscapeElements;
  resourceId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const nodeToTimepoint = (node: CytoscapeNode): Timepoint | undefined => {
  const inputDate = node.data.date;
  const resourceType: string = node.data.resource_type;
  const resourceId: string = node.data.id;

  let formattedDate: Date;

  if (inputDate) {
    if (typeof inputDate == "object") {
      // this should be handled in the backend and can be removed in the future
      formattedDate = new Date(inputDate[Object.keys(inputDate)[0]]); // first property of object
      formattedDate = new Date(formattedDate.toDateString());
    } else {
      formattedDate = new Date(inputDate);
      formattedDate = new Date(formattedDate.toDateString());
    }
    return {
      x: formattedDate!,
      y: resourceType,
      label: resourceId,
    };
  } else {
    return undefined;
  }
};

const Timeline = (props: TimelineProps) => {
  const [resourceInfoSelect, setResourceInfoSelect] =
    useState<InteractionItem[]>();

  const timepoints: Timepoint[] = [];

  props.elements.nodes.forEach((node) => {
    const timepoint = nodeToTimepoint(node);
    if (!(timepoint === undefined)) {
      timepoints.push(nodeToTimepoint(node)!);
    }
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="">
        <TimelineGraph
          timepoints={timepoints}
          setSelectedId={props.setSelectedId}
          setResourceInfoSelect={setResourceInfoSelect}
        />
      </div>
      <hr className="m-2" />
      <p className="font-semibold mb-2">Select Resource</p>
      {!resourceInfoSelect ? null : (
        <div className="grow overflow-scroll h-min-0 px-6">
          {resourceInfoSelect.map((item: InteractionItem, index) => (
            <button
              key={index}
              className="text-xs w-full bg-gray-100 mb-2 py-2 rounded-xl hover:bg-gray-200"
              onClick={async (e: React.MouseEvent) => {
                props.setSelectedId(e.currentTarget.innerHTML);
              }}
            >
              {timepoints[item.index].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
