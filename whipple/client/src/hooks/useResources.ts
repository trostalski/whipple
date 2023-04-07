import { fetcher } from "../api/fetcher";

export function fetchResources(
  workspaceId: string,
  resourceTypes: string[],
  datasetId: number | null,
  skip?: number,
  limit?: number
) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/resources`,
    {
      resource_types: resourceTypes.join(","),
      dataset_id: datasetId,
      skip: skip,
      limit: limit,
    }
  );
}
