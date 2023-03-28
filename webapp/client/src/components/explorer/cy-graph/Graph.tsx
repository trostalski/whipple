import React, { memo, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { GetGraphStyle } from "../../../styles/graph-style";
import cytoscape from "cytoscape";
import euler from "cytoscape-euler";
import { CyGraphProps } from "../../..//types";

const Graph = (props: CyGraphProps) => {
  const style = GetGraphStyle(props.resourceId);

  cytoscape.use(euler);

  const layout = {
    name: "euler",
    randomize: true,
    animate: false,
    gravity: -10,
    mass: 5,
    pull: 0.001,
    springLength: (edge: any) => 500,
  };

  if (!props.elements) {
    return <div>No data found.</div>;
  }

  console.log("rendering cygraph");
  return (
    <CytoscapeComponent
      cy={(cy: any) => {
        cy.nodes().ungrabify();
        cy.layout(layout).run();
        cy.on("click", "node", async (e: any) => {
          props.setSelectedId(e.target.data("id"));
        });
      }}
      elements={CytoscapeComponent.normalizeElements({
        nodes: props.elements.nodes,
        edges: props.elements.edges,
      })}
      style={{ width: "500px", height: "700px" }}
      stylesheet={style}
    ></CytoscapeComponent>
  );
};

export default memo(Graph);
