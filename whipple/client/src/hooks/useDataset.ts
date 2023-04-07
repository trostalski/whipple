import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

type Dataset = {
  id: string;
  ids: string[];
  title: string;
  description: string;
  size: string;
  created_at: string;
};

function fetchDataset(id: string, workspaceId: string) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/datasets/${id}`
  );
}

export function useDataset(id: string, workspaceId: string) {
  return useQuery<Dataset, Error>("dataset", () =>
    fetchDataset(id, workspaceId)
  );
}
