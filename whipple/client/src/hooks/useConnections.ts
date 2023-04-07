import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";
import { Resource } from "fhir/r4";
import { apiV1 } from "../constants";

export interface ConnectionData {
  connections: Resource[]; // list of fhir resources
  edges?: [string, string][]; // list of tuples of ids
}

export function fetchConnections(
  resourceId: string,
  resourceType: string,
  workspaceId: string,
  includeEdges: boolean
) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/${apiV1}/workspaces/${workspaceId}/resources/${resourceType}/${resourceId}/connections`,
    { include_edges: includeEdges }
  );
}

export const useConnections = (
  resourceId: string,
  resourceType: string,
  workspaceId: string,
  includeEdges: boolean
) => {
  const { data, error, isLoading } = useQuery<ConnectionData>(
    ["connections", resourceId, resourceType, workspaceId],
    () => fetchConnections(resourceId, resourceType, workspaceId, includeEdges)
  );

  return {
    data,
    error,
    isLoading,
  };
};
