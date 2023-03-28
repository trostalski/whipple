import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export function fetchDatasetIds(
  workspaceId: string,
  id: string,
  resourceType: string,
  limit: number
) {
  const limitStr = limit.toString();
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/datasets/${id}/resourceids`,
    {
      resourcetype: resourceType,
      limit: limitStr,
    }
  );
}
