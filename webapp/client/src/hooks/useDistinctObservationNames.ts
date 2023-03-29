import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

function fetchDistinctObservationNames(workspaceId: string) {
  const result = fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/distinct-observations`
  );
  if (!result) {
    return [];
  }
  return result;
}

export function useDistinctObservationNames(workspaceId: string) {
  return useQuery<string[], Error>(["distinct-observation-names"], () =>
    fetchDistinctObservationNames(workspaceId)
  );
}
