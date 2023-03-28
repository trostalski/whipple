import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";
import { Workspace } from "./useWorkspace";

function fetchWorkspaces() {
  return fetcher(`${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/`);
}

export function useWorkspaces() {
  return useQuery<Workspace[], Error>("workspaces", fetchWorkspaces);
}
