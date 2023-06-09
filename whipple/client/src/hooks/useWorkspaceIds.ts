import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export function fetchWorkspaceIds(
  workspaceId: string,
  resourceType: string,
  limit: number
) {
  const limitStr = limit.toString();
  const result = fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/resourceids`,
    {
      resourcetype: resourceType,
      limit: limitStr,
    }
  );
  if (!result) {
    return [];
  }
  return result;
}

export function useWorkspaceIds(
  workspaceId: string,
  resourceType: string,
  limit: number = 100
) {
  return useQuery<string[], Error>(
    ["workspaceIds", workspaceId, resourceType, limit],
    () => fetchWorkspaceIds(workspaceId, resourceType, limit)
  );
}
