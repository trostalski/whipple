import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import Wrapper from "../components/Wrapper";
import { resourceOptions } from "../constants";
import { useDataset } from "../hooks/useDataset";
import { fetchDatasetIds } from "../hooks/useDatasetIds";

const Dataset = () => {
  const { id } = useParams<{ id: string }>();
  const workspaceId = localStorage.getItem("workspaceId");

  const [searchInput, setSearchInput] = React.useState("");
  const [limit, setLimit] = React.useState(100);
  const [filterResourceType, setFilterResourceType] =
    React.useState<string>("");

  const { data, isLoading, error } = useDataset(id!, workspaceId!);

  const {
    data: datasetIds,
    isLoading: idsLoading,
    error: idsError,
    refetch: idsRefetch,
  } = useQuery<string[], Error>(["datasetIds", filterResourceType], () =>
    fetchDatasetIds(workspaceId!, id!, filterResourceType, limit)
  );

  if (error || idsError) return <div>An error occured</div>;

  return (
    <Wrapper>
      <div className="flex flex-col bg-white h-full text-xs rounded-xl p-4 shadow-md ">
        <div className="flex flex-row justify-between mb-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">
              {data?.title == "" ? "No Title" : data?.title}
            </h1>
            <p className="">
              Description:
              {data?.description == "" ? " No Description" : data?.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>Created at: {data?.created_at.split("T")[0]}</p>
            <p>Size: {data?.size}</p>
          </div>
        </div>
        <div className="w-full h-full bg-blue-100 rounded-xl p-4 overflow-scroll">
          <div className="flex flex-row items-center gap-2 mb-1">
            <p className="font-bold">Resource Ids</p>
            <Select
              defaultValue={""}
              placeholder="Resource Type"
              options={resourceOptions}
              className="w-56"
              onChange={(e: any) => setFilterResourceType(e.value)}
            ></Select>
            <input
              value={searchInput}
              placeholder="Filter"
              className="w-80 h-10 border-2 rounded-md p-2 grow focus:outline-blue-400"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <div className="flex w-48 justify-center items-center flex-row">
              <div className="flex flex-row justify-center items-center grow">
                <input
                  type="number"
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      idsRefetch();
                    }
                  }}
                  value={limit}
                  className="w-20 h-10 border-2 rounded-md p-2 focus:outline-blue-400"
                />
                <p>/{data?.size}</p>
              </div>
              <button
                className="hover:scale-105"
                onClick={() => {
                  idsRefetch();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="#000000"
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 489.645 489.645"
                  xmlSpace="preserve"
                >
                  <g>
                    <path d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3   c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5   c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8   c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2   C414.856,432.511,548.256,314.811,460.656,132.911z" />
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full h-full">
            {idsLoading || !datasetIds ? (
              <p>is Loading…</p>
            ) : (
              datasetIds
                .sort()
                .filter((id) =>
                  id.toLowerCase().includes(searchInput.toLowerCase())
                )
                .map((id) => (
                  <div key={id}>
                    <Link
                      to={`/patients/${id.split(/[:/]/)[1]}`}
                      className="hover:underline"
                    >
                      {id}
                    </Link>
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="w-full flex">
          <div className="grow"></div>
          <button className="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Dataset;
