import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export type DashboardCardData = {
  labels: string[];
  unit?: string;
  datasets: {
    data: number[];
    label?: string;
    backgroundColor?: string[];
  }[];
};

function fetchDashboardCardDataset(
  workspaceId: string,
  dashboard_card_id: string
) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/dashboard_cards/${dashboard_card_id}/data`
  );
}

export function useDashboardCardDataset(
  workspaceId: string,
  dashboard_card_id: string
) {
  return useQuery<DashboardCardData, Error>(
    `dashboard_card_dataset_${dashboard_card_id}`,
    () => fetchDashboardCardDataset(workspaceId, dashboard_card_id)
  );
}
