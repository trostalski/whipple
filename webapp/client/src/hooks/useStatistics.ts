import { useQuery } from "react-query";
import { fetcher } from "../api/fetcher";

export type RelevantResources =
  | "AllergyIntolerance"
  | "Condition"
  | "Encounter"
  | "General"
  | "Immunization"
  | "MedicationRequest"
  | "Observation"
  | "Patient"
  | "Practitioner"
  | "MedicationAdministration"
  | "Procedure";

export type Descriptor =
  | "display"
  | "code"
  | "birthdate"
  | "gender"
  | "country"
  | "resources";

export type Statistics = {
  [resourceType in RelevantResources]: {
    [descriptor in Descriptor]: { data: number; label: string }[];
  };
};

function fetchStatistics(dataset_id: string, workspaceId: string) {
  return fetcher(
    `${process.env.REACT_APP_SERVER_URL}/workspace/${workspaceId}/datasets/statistics/${dataset_id}`
  );
}

export function useStatistics(dataset_id: string, workspaceId: string) {
  return useQuery<Statistics, Error>("statistics", () =>
    fetchStatistics(dataset_id, workspaceId)
  );
}
