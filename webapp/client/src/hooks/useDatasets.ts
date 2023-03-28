import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export type Dataset = {
  id: string;
  title: string;
  description: string;
  size: string;
  created_at: String;
};

function fetchDatasets(workspaceId: string) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/datasets/`
  );
}

export function useDatasets(workspaceId: string) {
  return useQuery<Dataset[], Error>("datasets", () =>
    fetchDatasets(workspaceId)
  );
}
