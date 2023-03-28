import React, { useEffect, useState } from "react";
import DashboardPieChart from "../components/dashboard/DashboardPieChart";
import Select from "react-select";
import {
  Descriptor,
  RelevantResources,
  useStatistics,
} from "../hooks/useStatistics";
import { useDatasets } from "../hooks/useDatasets";
import Wrapper from "../components/Wrapper";

const groupBirthYear = (input: { label: string; data: number }[]) => {
  const yearCounts = new Map();
  const result: { label: string; data: number }[] = [];
  input.forEach((item) => {
    const year = item.label.split("-")[0];
    yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
  });
  yearCounts.forEach((value, key) => {
    result.push({ label: key, data: value });
  });
  return result;
};

const OldDashboard = () => {
  const workspaceId = localStorage.getItem("workspaceId");
  const {
    data: datasetData,
    isLoading: datasetLoading,
    error: datasetError,
  } = useDatasets(workspaceId!);
  const [totalNumberResources, setTotalNumberResources] = useState<number>(0);
  const [patientDescriptor, setPatientDescriptor] =
    useState<Descriptor>("gender");
  const [resourceTypeDetails, setResourceTypeDetails] =
    useState<RelevantResources>("Condition");
  const [selectedDataset, setSelectedDataset] = useState<string>("all");
  const [pieRange, setPieRange] = useState<number>(50);
  const { data, isLoading, error, refetch } = useStatistics(
    selectedDataset,
    workspaceId!
  );

  useEffect(() => {
    let totalResources = 0;

    if (data) {
      data.General.resources.forEach((resource) => {
        totalResources += resource.data;
      });
      setTotalNumberResources(totalResources);
    }
  }, [data, datasetData]);

  useEffect(() => {
    refetch();
  }, [selectedDataset]);

  if (error || datasetError) return <div>An error occured</div>;
  if (isLoading || datasetLoading) return <div>Loading...</div>;

  if (!data) return null;

  let selectOptions: any = [{ value: "all", label: "All Data" }];
  if (datasetData) {
    datasetData.forEach((dataset) => {
      selectOptions.push({ value: dataset.id, label: dataset.title });
    });
  }

  return (
    <Wrapper>
      <div className="flex flex-col h-full gap-12 text-xs rounded-xl p-4">
        <div className="flex gap-4 flex-row h-1/6 justify-center items-center">
          <div className="bg-white p-4 h-40 w-1/2 rounded-xl shadow-lg">
            {datasetLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col">
                <div className="mb-2">
                  <Select
                    placeholder="Select a dataset"
                    defaultValue={"All Data"}
                    options={selectOptions}
                    onChange={(e: any) => {
                      setSelectedDataset(e.value);
                    }}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-lg text-gray-400">
                    Total Number of Resources:
                  </p>
                  <p className="text-lg font-semibold">
                    {totalNumberResources}
                  </p>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-lg text-gray-400">Number of Datasets: </p>
                  <p className="text-lg font-semibold">{datasetData?.length}</p>
                </div>
                <div className="flex flex-row gap-4">
                  <p className="text-lg text-gray-400">Number of Cohorts: </p>
                  <p className="text-lg font-semibold">0</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-4 h-40 w-1/2 rounded-xl shadow-lg overflow-scroll">
            <div className="">
              <h1 className="text-lg font-semibold">Resource Counts</h1>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-x-28">
                {data.General.resources.map((resource) => (
                  <div key={resource.label} className="flex flex-row gap-4">
                    <p className="text-lg text-gray-400">{resource.label}: </p>
                    <p className="text-lg font-semibold">{resource.data}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 h-full grow justify-center items-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="flex flex-col bg-white p-4 h-full w-1/2 rounded-xl shadow-lg">
                <div className="">
                  <h1 className="text-lg font-semibold">Patients</h1>
                </div>
                <div className="flex h-full gap-16">
                  <div className="flex w-40 flex-col justify-evenly">
                    {Object.keys(data.Patient).map((key) => (
                      <button
                        className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
                        key={key}
                        onClick={() => {
                          setPatientDescriptor(key as Descriptor);
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <div className="self-center justify-self-center grow">
                    {/* {patientDescriptor == "birthdate" ? (
                      <ResourcePie
                        data={groupBirthYear(data.Patient[patientDescriptor])}
                      />
                    ) : (
                      <ResourcePie data={data.Patient[patientDescriptor]} />
                    )} */}
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-white p-4 h-full w-1/2 rounded-xl shadow-lg">
                <div className="">
                  <h1 className="text-lg font-semibold">
                    {resourceTypeDetails}
                  </h1>
                </div>
                <div className="flex h-full gap-16">
                  <div className="flex w-40 flex-col justify-evenly">
                    {Object.keys(data)
                      .filter((key) => !(key == "Patient" || key == "General"))
                      .filter(
                        (key) =>
                          data[key as RelevantResources].display.length > 0
                      )
                      .map((key) => (
                        <button
                          className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
                          key={key}
                          onClick={() => {
                            setResourceTypeDetails(key as RelevantResources);
                          }}
                        >
                          {key}
                        </button>
                      ))}
                  </div>
                  <div className="self-center justify-self-center grow">
                    {/* <ResourcePie
                      data={data[resourceTypeDetails].display
                        .sort((a, b) => b.data - a.data)
                        .filter((_, i) => i < pieRange)}
                    /> */}
                    <div className="flex justify-center">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={pieRange}
                        onChange={(e) => {
                          setPieRange(Number(e.target.value));
                        }}
                      />
                      <p>{pieRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default OldDashboard;
