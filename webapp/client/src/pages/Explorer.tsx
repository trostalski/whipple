import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import Timeline from "../components/explorer/Timeline";
import { CytoscapeElements } from "../types";
import { encodeResourceId } from "../utils";
import CyGraph from "../old/cy-graph/CyGraph";
import ResourceOverview from "../components/explorer/ResourceOverview";
import Select from "react-select";
import { resourceOptions } from "../constants";
import { Resource } from "fhir/r4";
import { fetchConnections } from "../hooks/useConnections";
import { useQuery } from "react-query";
import { fetchResource } from "../hooks/useResource";
import Wrapper from "../components/Wrapper";
import { useLocation, useSearchParams } from "react-router-dom";

const displayElement = (
  displayFormat: string,
  elements: CytoscapeElements,
  searchId: string,
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let element;
  switch (displayFormat) {
    case "overview":
      element = (
        <ResourceOverview
          elements={elements}
          resourceId={searchId}
          setSelectedId={setSelectedId}
        />
      );
      break;
    case "graph":
      element = (
        <CyGraph
          elements={elements}
          resourceId={searchId}
          setSelectedId={setSelectedId}
        />
      );
      break;
    case "timeline":
      element = (
        <Timeline
          elements={elements}
          resourceId={searchId}
          setSelectedId={setSelectedId}
        />
      );
      break;

    default:
      break;
  }
  return element;
};

const Explorer = () => {
  const resourceId = useRef<string>("");
  const workspaceId = localStorage.getItem("workspaceId");
  const [searchInput, setSearchInput] = useState<string>("");
  const [elements, setElements] = useState<CytoscapeElements>({
    nodes: [],
    edges: [],
  });
  const [displayFormat, setDisplayFormat] = useState("overview");
  const [resourceInfo, setResourceInfo] = useState<Resource>();
  const [resourceType, setResourceType] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [encodedSearchId, setEncodedSearchId] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchInput(value);
  };

  const location = useLocation();

  const {
    data: connectionsData,
    error: connectionsError,
    isLoading: connectionsIsLoading,
  } = useQuery(
    ["connections", encodedSearchId]
    // () => fetchConnections(encodedSearchId, workspaceId!),
    // {
    //   onSuccess: (connectionsData) => {
    //     setElements(connectionsData);
    //   },
    // }
  );

  const {
    data: resourceInfoData,
    error: resourceInfoError,
    isLoading: resourceInfoIsLoading,
  } = useQuery<Resource, Error>(
    ["resource", selectedId],
    // () => fetchResource(encodeResourceId(selectedId!), workspaceId!),
    {
      enabled: selectedId !== "",
      onSuccess: (resourceInfoData) => {
        setResourceInfo(resourceInfoData);
      },
    }
  );

  const handleKeyDown = async (
    event: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  ) => {
    if (event.key === "Enter") {
      resourceId.current = searchInput;
      const tempSearchId = resourceType + "/" + resourceId.current;
      setSelectedId(tempSearchId);
      setEncodedSearchId(encodeResourceId(tempSearchId));
    }
  };

  useEffect(() => {
    if (location.state) {
      const tempSearchId = location.state.id as string;
      setResourceType(tempSearchId.split("/")[0]);
      setSearchInput(tempSearchId.split("/")[1]);
      setSelectedId(tempSearchId);
      setEncodedSearchId(encodeResourceId(tempSearchId));
    }
  }, [location.state]);

  return (
    <Wrapper>
      <div className="flex flex-col bg-white h-full text-xs rounded-xl p-4 shadow-md">
        <div className="flex flex-row items-center space-x-6 ">
          <div className="flex items-center flex-row gap-2">
            <Select
              defaultValue={"Patient"}
              placeholder="Resource Type"
              options={resourceOptions}
              className="w-56"
              onChange={(e: any) => setResourceType(e.value)}
            ></Select>
            <input
              value={searchInput}
              placeholder="ID"
              className="w-80 h-10 border-2 rounded-md p-2 focus:outline-blue-400"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
            onClick={() => {
              setDisplayFormat("overview");
            }}
          >
            Overview
          </button>
          <button
            className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
            onClick={() => {
              setDisplayFormat("graph");
            }}
          >
            Graph
          </button>
          <button
            className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
            onClick={() => {
              setDisplayFormat("timeline");
            }}
          >
            Timeline
          </button>
        </div>
        <hr className="my-2" />
        <div className="flex grow min-h-0">
          <div className="h-full w-full">
            {displayElement(displayFormat, elements, searchId, setSelectedId)}
          </div>
          <div className="bg-blue-100 rounded-xl w-2/3 p-4 overflow-scroll">
            {!resourceInfo ? (
              <div className="h-6 w-full"></div>
            ) : (
              <p className="text-md h-6 w-full whitespace-nowrap ml-2 font-extralight">
                {resourceInfo["resourceType"] + "/" + resourceInfo["id"]}
              </p>
            )}
            <pre className="">{JSON.stringify(resourceInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Explorer;
