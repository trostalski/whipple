import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export type Workspace = {
  id: string;
  title: string;
  created_at: String;
};

function fetchWorkspace(workspaceId: string) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}`
  );
}

export function useWorkspace() {
  const workspaceId = localStorage.getItem("workspaceId");
  return useQuery<Workspace, Error>("workspace", () =>
    fetchWorkspace(workspaceId!)
  );
}
