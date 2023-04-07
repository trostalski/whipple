import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import DatasetImportModal from "../components/home/DatasetImportModal";
import { toastPromise } from "../components/toasts";
import Wrapper from "../components/Wrapper";
import { useDatasets } from "../hooks/useDatasets";

interface ImportDataModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  importMethod: string;
}

const Datasets = () => {
  const [showDatasetImportModal, setShowDatasetImportModal] = useState(false);
  const queryClient = useQueryClient();
  const workspaceId = localStorage.getItem("workspaceId");
  const { isLoading, error, data } = useDatasets(workspaceId!);

  const { mutate: deleteMutate } = useMutation(
    (id: string) => {
      const response = axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/datasets/${id}`
      );
      toastPromise(response, "Deleting Dataset...");
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("datasets");
      },
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete the dataset?")) {
      deleteMutate(id);
    } else {
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper>
      <div
        className="h-full w-full flex flex-col text-xs p-4 overflow-scroll"
        onClick={() => {}}
      >
        <div className="flex flex-row items-center w-full h-12 text-md">
          <p className="grow text-lg font-extralight">Datasets</p>
          <div className="relative">
            <button
              data-dropdown-toggle="dropdown"
              className="bg-blue-500 w-48 shadow-md rounded-md py-2 px-6 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowDatasetImportModal(!showDatasetImportModal);
              }}
            >
              Import Data
            </button>
          </div>
        </div>
        {data?.length == 0 ? (
          <div className="flex flex-col shadow-md text-gray-500 justify-center bg-white h-12 rounded-xl p-4">
            No Data
          </div>
        ) : isLoading ? (
          <p>Loading data…</p>
        ) : (
          data?.map((dataset) => {
            return (
              <div key={dataset.id}>
                <div className="flex flex-row justify-between bg-white h-24 rounded-xl shadow-md mb-4 p-4">
                  <div className="flex flex-col justify-evenly">
                    <div className="flex flex-col">
                      <p>Title: {dataset.title}</p>
                      <p>Description: {dataset.description}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <Link to={`/dataset/${dataset.id}`}>
                        <p className="text-blue-500 w-12 rounded-md hover:font-bold">
                          Details
                        </p>
                      </Link>
                      <button
                        className="text-red-400 w-16 rounded-md hover:font-bold"
                        onClick={() => {
                          handleDelete(dataset.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-evenly">
                    <p>
                      Resources: <b>{dataset.size}</b>
                    </p>
                    <p>
                      Created at: <b>{dataset.created_at.split("T")[0]}</b>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!showDatasetImportModal ? null : (
          <DatasetImportModal setShow={setShowDatasetImportModal} />
        )}
      </div>
    </Wrapper>
  );
};

export default Datasets;
