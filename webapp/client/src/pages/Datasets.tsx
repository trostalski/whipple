import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import ApiImport from "../old/ApiImport";
import FileImport from "../components/home/FileImport";
import ModalWrapper from "../components/ModalWrapper";
import { toastPromise } from "../components/toasts";
import Wrapper from "../components/Wrapper";
import { useDatasets } from "../hooks/useDatasets";

interface AddDataModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddDataModal = (props: AddDataModalProps) => {
  return (
    <ModalWrapper setShow={props.setShow} size="lg">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <p>Add Data</p>
        </div>
      </div>
    </ModalWrapper>
  );
};

interface ImportDataModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  importMethod: string;
}

const ImportFromServer = () => {
  return <div>Import Server</div>;
};

const ImportDataModal = (props: ImportDataModalProps) => {
  let modalElement;
  switch (props.importMethod) {
    case "file":
      modalElement = <FileImport setShow={props.setShow} />;
      break;
    case "api":
      modalElement = <ApiImport setShow={props.setShow} />;
      break;
    case "server":
      modalElement = <ImportFromServer />;
      break;
    default:
      break;
  }

  return (
    <ModalWrapper setShow={props.setShow} size="lg">
      {modalElement}
    </ModalWrapper>
  );
};

const Datasets = () => {
  const [showDropDown, setshowDropDown] = useState(false);
  const [importDataModal, setImportDataModal] = useState(false);
  const [importMethod, setImportMethod] = useState<string>("");
  const [addDataModalIsOpen, setAddDataModalIsOpen] = useState(false);
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

  const handleImportClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setImportMethod(e.currentTarget.name);
    setshowDropDown(false);
    setImportDataModal(true);
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Wrapper>
      <div
        className="h-full w-full flex flex-col text-xs p-4 overflow-scroll"
        onClick={() => {
          setshowDropDown(false);
        }}
      >
        <div className="flex flex-row items-center w-full h-12 text-md">
          <p className="grow text-lg font-extralight">Datasets</p>
          <div className="relative">
            <button
              data-dropdown-toggle="dropdown"
              className="bg-blue-500 shadow-md rounded-md py-2 px-6 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setshowDropDown(!showDropDown);
              }}
            >
              Import Data
            </button>
            <div
              className={`absolute bg-white p-4 shadow-xl z-10 rounded-xl mt-2 ${
                showDropDown ? "display" : "hidden"
              }`}
            >
              <ul className="space-y-2">
                <button
                  name="file"
                  className="hover:underline"
                  onClick={(e) => {
                    handleImportClick(e);
                  }}
                >
                  From File
                </button>
                {/* <button
                  name="api"
                  className="hover:underline"
                  onClick={(e) => {
                    handleImportClick(e);
                  }}
                >
                  Post to API
                </button>
                <button
                  name="server"
                  className="hover:underline text-left"
                  onClick={(e) => {
                    handleImportClick(e);
                  }}
                >
                  Connect to Server
                </button> */}
              </ul>
            </div>
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

        {!importDataModal ? null : (
          <ImportDataModal
            importMethod={importMethod}
            setShow={setImportDataModal}
          />
        )}
        {!addDataModalIsOpen ? null : (
          <AddDataModal setShow={setAddDataModalIsOpen} />
        )}
      </div>
    </Wrapper>
  );
};

export default Datasets;
