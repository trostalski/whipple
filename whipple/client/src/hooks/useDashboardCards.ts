import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";
import { InputData } from "../components/dashboard/DashboardCardModal";

export type DashboardCardInfo = InputData & {
  id: string;
};

function fetchDashboardCards(workspaceId: string) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/dashboard_cards/`
  );
}

export function useDashboardCards(workspaceId: string) {
  return useQuery<DashboardCardInfo[], Error>("dashboard_cards", () =>
    fetchDashboardCards(workspaceId)
  );
}
