import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ServerPostResponse } from "../../types";
import { toastError } from "../toasts";
import { Metadata } from "./FileImport";

interface ApiImportProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApiImport = (props: ApiImportProps) => {
  const [metaData, setMetaData] = useState<Metadata>({
    title: "",
    description: "",
  });
  const [inputData, setInputData] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate, data } = useMutation(
    () => {
      const body = {
        metadata: metaData,
        data: inputData,
      };

      return axios.post<ServerPostResponse>(
        `${process.env.REACT_APP_SERVER_URL}/resources`,
        {
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("datasets");
        if (data?.data.response == false) {
          toastError(data.data.message);
        } else {
          props.setShow(false);
        }
      },
    }
  );

  const handleSubmit = () => {
    try {
      JSON.parse(inputData);
      mutate();
    } catch (e) {
      toastError("Invalid JSON!");
    }
  };

  const handleCancel = () => {
    props.setShow(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold" htmlFor="title">
          Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300"
          id="title"
          type="text"
          placeholder="Title of the dataset"
          value={metaData?.title}
          onChange={(e) => {
            setMetaData({ ...metaData, title: e.target.value });
          }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300"
          placeholder="Description of the dataset"
          value={metaData?.description}
          onChange={(e) => {
            setMetaData({ ...metaData, description: e.target.value });
          }}
        ></textarea>
      </div>
      <div className="grow">
        <div className="flex">
          <label htmlFor="data" className="block grow text-gray-700 font-bold">
            JSON
          </label>
        </div>
        <textarea
          id="data"
          rows={10}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300"
          placeholder="Data"
          value={inputData}
          onChange={(e) => {
            const value = e.target.value;
            setInputData(value);
          }}
        ></textarea>
      </div>
      <div className="flex flex-row w-full items-center">
        <div className="flex flex-row gap-2 grow justify-center items-center">
          <p className="text-gray-400 text-lg">API Endpoint:</p>
          <p className="grow text-lg font-thin">
            http://localhost:5000/resources
          </p>
        </div>
        <div className="flex flex-row gap-8">
          <button
            className="w-24 bg-red-200 rounded-xl p-2 hover:bg-red-400"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="w-24 bg-blue-200 rounded-xl p-2 hover:bg-blue-400"
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiImport;
