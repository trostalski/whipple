import React, { memo, useState } from "react";

import { CyGraphProps } from "../../../types";
import Graph from "./Graph";

const CyGraph = (props: CyGraphProps) => {
  return (
    <div className="flex overflow-hidden w-full h-full">
      <Graph
        elements={props.elements}
        resourceId={props.resourceId}
        setSelectedId={props.setSelectedId}
      />
    </div>
  );
};

export default memo(CyGraph);
