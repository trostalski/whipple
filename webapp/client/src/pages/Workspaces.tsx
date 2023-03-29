import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import LogoutButton from "../components/buttons/LogoutButton";
import { toastPromise } from "../components/toasts";
import { useWorkspaces } from "../hooks/useWorkspaces";

const Workspaces = () => {
  const [workspaceName, setWorkspaceName] = React.useState<string>("");
  const [editId, setEditId] = React.useState<string>("");
  const { data, isLoading, error, refetch } = useWorkspaces();

  const navigate = useNavigate();

  const { mutate: createMutate } = useMutation(
    () => {
      const data = axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces`,
        {}
      );
      toastPromise(
        data,
        "Creating workspace...",
        "Workspace created successfully!",
        "Error creating workspace!"
      );
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const { mutate: deleteMutate } = useMutation(
    (workspaceId: string) => {
      const data = axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}`
      );
      toastPromise(
        data,
        "Deleting workspace...",
        "Workspace deleted successfully!",
        "Error deleting workspace!"
      );
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const { mutate: updateMutate } = useMutation(
    (workspaceId: string) => {
      const data = axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}`,
        { title: workspaceName }
      );
      return data;
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  return (
    <div className="container mx-auto h-full w-full">
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col  h-3/4 w-3/4 text-xs">
          <div className="flex flex-row h-20">
            <h1 className="text-lg grow font-extralight">Workspaces</h1>
            <button
              className="bg-blue-500 rounded-md h-8 shadow-md py-2 px-4 hover:bg-blue-700 text-white"
              onClick={() => createMutate()}
            >
              Create Workspace
            </button>
          </div>
          <div className="flex flex-col gap-4 overflow-scroll h-full">
            {data?.length == 0 ? (
              <div className="flex h-12 flex-row p-4 items-center bg-white text-gray-400 shadow-md rounded-xl">
                No Workspaces
              </div>
            ) : (
              data?.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex flex-row p-4 items-center bg-white shadow-md rounded-xl"
                >
                  <div
                    className="flex flex-col h-full grow justify-center hover:cursor-pointer"
                    onClick={() => {
                      if (editId == "") {
                        // no edit mode
                        localStorage.setItem("workspaceId", workspace.id);
                        if (
                          localStorage.getItem("workspaceId") == workspace.id
                        ) {
                          navigate("/datasets");
                        }
                      }
                    }}
                  >
                    {editId == workspace.id ? (
                      <input
                        className="text-md w-3/4 h-8 border-2 rounded-md focus:outline-blue-500"
                        value={workspaceName}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditId("");
                            updateMutate(workspace.id);
                          }
                        }}
                      />
                    ) : (
                      <p className="text-md">{workspace.title}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {editId == workspace.id ? (
                      <button
                        className="text-emerald-500 w-32 rounded-md hover:font-bold"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditId("");
                            updateMutate(workspace.id);
                          }
                        }}
                        onClick={() => {
                          updateMutate(workspace.id);
                          setEditId("");
                        }}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 w-32 rounded-md hover:font-bold"
                        onClick={() => {
                          setWorkspaceName(workspace.title);
                          setEditId(workspace.id);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-gray-500 w-32 rounded-md hover:font-bold"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete the workspace?"
                          )
                        ) {
                          deleteMutate(workspace.id);
                        } else {
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspaces;
