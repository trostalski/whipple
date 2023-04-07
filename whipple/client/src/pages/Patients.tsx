import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import Select from "react-select";
import { useDatasets } from "../hooks/useDatasets";
import { fetchResources } from "../hooks/useResources";
import { useQuery } from "react-query";
import { Patient } from "fhir/r4";
import { Link } from "react-router-dom";

const Patients = () => {
  const workspaceId = localStorage.getItem("workspaceId");
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(
    null
  );
  const [limit, setLimit] = useState<number>(200);
  const [skip, setSkip] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");

  const {
    data: datasets,
    isLoading: datasetsLoading,
    error: datasetsError,
  } = useDatasets(workspaceId!);

  const {
    data: patients,
    isLoading: patientsLoading,
    error: patientsError,
  } = useQuery<Patient[], Error>(
    ["patients", selectedDatasetId, limit, skip],
    () =>
      fetchResources(workspaceId!, ["Patient"], selectedDatasetId, skip, limit)
  );

  if (datasetsError || patientsError) return <div>An error occured</div>;

  let selectOptions: any = [{ value: null, label: "All Patients" }];
  if (datasets) {
    datasets.forEach((dataset) => {
      selectOptions.push({ value: dataset.id, label: dataset.title });
    });
  }

  return (
    <Wrapper>
      <div className="h-full w-full flex flex-col text-xs p-4 overflow-scroll">
        <div className="flex flex-row items-center w-full h-12 text-md">
          <p className="grow text-lg font-extralight">Patients</p>
          <div className="flex flex-row gap-4">
            <input
              value={searchInput}
              placeholder="Search"
              className="w-80 h-10 border-gray-200 border-2 border-solid rounded-md p-2 focus:outline-blue-400"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Select
              placeholder="All Datasets"
              defaultValue={null}
              options={selectOptions}
              className="w-56"
              onChange={(e: any) => {
                setSelectedDatasetId(e.value);
              }}
            />
          </div>
        </div>
        <div className="p-4 overflow-scroll h-full">
          {patients?.length == 0 ? (
            <div className="bg-white w-full h-16 border-b-2 border-gray-200 flex flex-row items-center justify-between px-4">
              <p>No patients found.</p>
            </div>
          ) : (
            <div className="rounded-md shadow-md bg-white">
              <div className="flex flex-col ">
                {patients?.map((patient) => (
                  <Link to={`/patients/${patient.id}`} key={patient.id}>
                    <div className="bg-white w-full h-12 border-b-2 border-gray-200 flex flex-row items-center justify-between px-4 hover:font-semibold">
                      <div className="flex flex-col w-48">
                        <p>{patient.name ? patient.name[0].family : null}</p>
                      </div>
                      <div className="w-24">
                        <p>{patient.gender}</p>
                        <p>{patient.birthDate}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full flex-row px-4 mt-4">
          <div className="grow" />
          <div className="flex flex-row gap-4">
            <button
              className="text-blue-500 w-24 rounded-md hover:font-bold"
              onClick={() => setSkip(Math.max(0, skip - limit))}
            >
              Previous Page
            </button>
            <button
              className="text-blue-500 w-24 rounded-md hover:font-bold"
              onClick={() => setSkip(skip + limit)}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Patients;
