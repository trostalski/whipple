import { Resource } from "fhir/r4";
import React, { memo, useEffect, useState } from "react";
import { CytoscapeElements, CytoscapeNode } from "../../types";
import { formatDateString, stripTypeFromId } from "../../utils";

interface ResourceOverviewProps {
  elements: CytoscapeElements;
  resourceId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const ResourceOverview = (props: ResourceOverviewProps) => {
  const [availableResources, setAvailableResources] = useState<string[]>([]);
  const [resourceTypeSeletion, setResourceTypeSelection] = useState<string>();

  useEffect(() => {
    const resourceList: string[] = [];

    if (props.elements) {
      props.elements.nodes.forEach((node: CytoscapeNode) => {
        if (!resourceList.includes(node.data.resource_type)) {
          resourceList.push(node.data.resource_type);
        }
      });
    }
    setAvailableResources(resourceList);
  }, [props.elements]);

  return (
    <div className="flex w-full h-full">
      {availableResources.length === 0 ? null : (
        <div className="w-48 py-6">
          <h3 className="text-sm font-bold">Connections</h3>
          {availableResources.map((resource: string) => (
            <div key={resource}>
              <button
                key={resource}
                className={`text-xs text-left w-full h-full ${
                  resource === resourceTypeSeletion ? "underline" : null
                } hover:underline`}
                onClick={() => {
                  setResourceTypeSelection(resource);
                }}
              >
                {resource}
              </button>
            </div>
          ))}
        </div>
      )}
      {!resourceTypeSeletion ? null : (
        <div className="grid grid-cols-3 w-full gap-4 items-start auto-rows-min overflow-scroll p-6">
          <h3 className="text-sm font-bold">Ids</h3>
          <h3 className="text-sm font-bold">Keywords</h3>
          <h3 className="text-sm font-bold">Date</h3>
          {props.elements.nodes
            .filter((node) => node.data.resource_type == resourceTypeSeletion)
            .sort((a, b) => {
              const dateA: Date = new Date(a.data.date);
              const dateB: Date = new Date(b.data.date);
              return Number(dateB) - Number(dateA);
            })
            .map((node) => (
              <React.Fragment key={node.data.id}>
                <button
                  className={`text-xs text-left col-start-1 col-end-1 ${
                    node.data.id === props.resourceId ? "underline" : null
                  } hover:underline`}
                  onClick={async () => {
                    props.setSelectedId(node.data.id);
                  }}
                >
                  {stripTypeFromId(node.data.id)}
                </button>
                <p className="text-xs col-start-2 col-end-2">
                  {node.data.display ? node.data.display : null}
                </p>
                <p className="text-xs col-start-3 col-end-3">
                  {formatDateString(node.data.date)
                    ? formatDateString(node.data.date)
                    : null}
                </p>
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

export default memo(ResourceOverview);
