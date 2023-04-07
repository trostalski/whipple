import { Resource } from "fhir/r4";

export interface CyGraphProps {
  elements: CytoscapeElements;
  resourceId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export type CytoscapeEdge = {
  data: { source: string; target: string };
};

export type Edge = {
  source: string;
  target: string;
};

export type Node = {
  date: string;
  id: string;
  resource_type: string;
  display: string[];
};

export type CytoscapeNode = {
  data: { date: string; id: string; resource_type: string; display: string[] };
};

export type CytoscapeElements = {
  edges: Array<CytoscapeEdge>;
  nodes: Array<CytoscapeNode>;
};

export type Elements = {
  edges: Array<Edge>;
  nodes: Array<Node>;
};

export interface Timepoint {
  x: Date;
  y: string;
  label: string;
}

export interface OptionType {
  value: string;
  label: string;
}

export type searchParam = {
  id: number;
  name: string;
  value: string;
  comparator?: string;
};

export type SearchParams = {
  resourceType: string;
  id: number;
  params: searchParam[];
};

export type ServerPostResponse = {
  message: string;
  response: boolean;
};
