import { useQuery, UseQueryOptions } from "react-query";
import { fetcher } from "../api/fetcher";

export function fetchResource(
  resourceId: string,
  resourceType: string,
  workspaceId: string
) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/resources/${resourceType}/${resourceId}`
  );
}

export function useResource<T>(
  resourceId: string,
  resourceType: string,
  workspaceId: string
) {
  return useQuery<T>(["resource", resourceId, workspaceId], () =>
    fetchResource(resourceId, resourceType, workspaceId)
  );
}
