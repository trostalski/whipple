import React, { useState } from "react";
import { useParams } from "react-router";
import Wrapper from "../components/Wrapper";
import { useResource } from "../hooks/useResource";
import {
  Observation,
  Patient,
  Resource,
  Encounter,
  Condition,
  AllergyIntolerance,
  DiagnosticReport,
  Specimen,
  MedicationAdministration,
} from "fhir/r4";
import { ConnectionData, useConnections } from "../hooks/useConnections";
import Select from "react-select";
import VisNetwork from "../components/patient/VisNetwork";
import EncounterList from "../components/patient/EncounterList";
import VisTimeline from "../components/patient/VisTimeline";

export interface PatientData {
  encounters: Encounter[];
  observations: Observation[];
  conditions: Condition[];
  allergies: AllergyIntolerance[];
  diagnosticReports: DiagnosticReport[];
  specimens: Specimen[];
  medicationAdministrations: MedicationAdministration[];
}

const getPatientData = (input: Resource[]) => {
  const encounters = input.filter(
    (resource) => resource.resourceType === "Encounter"
  );
  const observations = input.filter(
    (resource) => resource.resourceType === "Observation"
  );
  const conditions = input.filter(
    (resource) => resource.resourceType === "Condition"
  );
  const allergies = input.filter(
    (resource) => resource.resourceType === "AllergyIntolerance"
  );
  const diagnosticReports = input.filter(
    (resource) => resource.resourceType === "DiagnosticReport"
  );
  const specimens = input.filter(
    (resource) => resource.resourceType === "Specimen"
  );
  const medicationAdministrations = input.filter(
    (resource) => resource.resourceType === "MedicationAdministration"
  );

  return {
    encounters: encounters as Encounter[],
    observations: observations as Observation[],
    conditions: conditions as Condition[],
    allergies: allergies as AllergyIntolerance[],
    diagnosticReports: diagnosticReports as DiagnosticReport[],
    specimens: specimens as Specimen[],
    medicationAdministrations:
      medicationAdministrations as MedicationAdministration[],
  };
};

const displayElement = (
  displayFormat: string,
  connectionData: ConnectionData,
  patientData: PatientData
) => {
  let element;
  switch (displayFormat) {
    case "overview":
      element = <EncounterList patientData={patientData} />;
      break;
    case "network":
      element = <VisNetwork connectionData={connectionData} />;
      break;
    case "timeline":
      element = <VisTimeline connectionData={connectionData} />;
      break;
    default:
      break;
  }
  return element;
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const workspaceId = localStorage.getItem("workspaceId");
  const [displayFormat, setDisplayFormat] = useState("overview");

  const {
    data: patient,
    isLoading: patientIsLoading,
    error: patientError,
  } = useResource<Patient>(id!, "Patient", workspaceId!);

  const {
    data: connectionData,
    isLoading: connectionsIsLoading,
    error: connectionsError,
  } = useConnections(id!, "Patient", workspaceId!, true);

  const displayOptions: any = [
    { value: "overview", label: "Overview" },
    { value: "network", label: "Network" },
    { value: "timeline", label: "Timeline" },
  ];

  if (patientError || connectionsError) {
    return <div>An error occured</div>;
  }

  if (patientIsLoading) {
    return null;
  }

  return (
    <Wrapper>
      <div className="h-full w-full flex flex-col text-xs p-4">
        <div className="flex flex-row items-center w-full h-12 text-md">
          <div className="flex flex-col grow">
            <p className="grow text-lg font-extralight">
              {!patient?.name ? "Unknown" : patient?.name[0].family}
            </p>
            <div className="flex flex-row font-extralight">
              <p>{patient?.gender + ", " + patient?.birthDate}</p>
            </div>
          </div>
          <Select
            defaultValue={"overview"}
            placeholder="Overview"
            options={displayOptions}
            className="w-56"
            onChange={(e: any) => setDisplayFormat(e.value)}
          ></Select>
        </div>
        {!connectionData?.connections || connectionsIsLoading
          ? null
          : displayElement(
              displayFormat,
              connectionData!,
              getPatientData(connectionData?.connections!)
            )}
      </div>
    </Wrapper>
  );
};

export default PatientPage;
