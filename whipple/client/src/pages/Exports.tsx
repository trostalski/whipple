import React from "react";
import Wrapper from "../components/Wrapper";
import Select from "react-select";
import { useDatasets } from "../hooks/useDatasets";

const Exports = () => {
  const workspaceId = localStorage.getItem("workspaceId");
  const { data: datasets } = useDatasets(workspaceId!);
  return (
    <Wrapper>
      <div className="h-full w-full flex flex-col text-xs p-4 overflow-scroll">
        <div className="flex flex-row items-center w-full h-12 text-md">
          <p className="grow text-lg font-extralight">Export</p>
        </div>
        <div>
          <div className="flex flex-col justify-between bg-white h-24 rounded-xl shadow-md mb-4 p-4">
            <div className="">
              <label htmlFor="dataSource">Data source</label>
              <Select
                id="dataSource"
                name="dataSource"
                options={datasets?.map((dataset) => ({
                  value: dataset.id,
                  label: dataset.title,
                }))}
                placeholder={"Select a data source"}
                className="w-64"
              ></Select>
            </div>
            <div>
              <label htmlFor="dataElements">Data Elements</label>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Exports;
