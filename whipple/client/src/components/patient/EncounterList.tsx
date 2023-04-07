import React from "react";
import { PatientData } from "../../pages/PatientPage";
import { getDateForResource, getDisplayForResource } from "./utils";

interface EncountersProps {
  patientData: PatientData;
}

interface ResourceListProps {
  patientData: PatientData;
  resourceType: keyof PatientData;
}

const ResourceList = (props: ResourceListProps) => {
  if (props.patientData[props.resourceType].length === 0) {
    return null;
  }
  return (
    <div className="relative">
      <h1 className="sticky w-full bg-slate-50 top-0 text-lg">
        {props.resourceType.charAt(0).toUpperCase() +
          props.resourceType.slice(1)}
      </h1>
      {!props.patientData[props.resourceType] ? (
        <div className="flex flex-row h-10 bg-white shadow-md w-full border-b-2 border-gray-200  items-center justify-between px-4">
          No Resources found.
        </div>
      ) : (
        <div className="flex flex-col overflow-scroll">
          {props.patientData[props.resourceType]
            ?.sort((a, b) => {
              const dateA = getDateForResource(a);
              const dateB = getDateForResource(b);
              if (!dateA || !dateB) {
                return 0;
              } else {
                return Number(new Date(dateB)) - Number(new Date(dateA));
              }
            })
            .map((resource) => (
              <div
                key={resource.id}
                className="flex flex-row h-10 bg-white shadow-md w-full border-b-2 border-gray-200  items-center justify-between px-4"
              >
                <div className="flex flex-col text-md w-28 justify-center flex-grow h-full">
                  <p>
                    {!getDisplayForResource(resource)
                      ? null
                      : getDisplayForResource(resource)}
                  </p>
                </div>
                <div className="flex flex-col text-xs text-gray-500 font-light">
                  <p>{getDateForResource(resource)}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const EncounterList = (props: EncountersProps) => {
  const { patientData } = props;
  return (
    <div className="grid grid-cols-2 w-full p-4 gap-4">
      {Object.entries(patientData)
        .filter(([key, value]) => value.length > 0)
        .map(([key, value], idx) => (
          <div
            key={key}
            className={`max-h-screen overflow-scroll ${
              idx % 2 == 0 ? "col-start-1 col-end-1" : "col-start-2 col-end-2"
            }`}
          >
            <ResourceList patientData={patientData} resourceType={key as any} />
          </div>
        ))}
    </div>
  );
};

export default EncounterList;
