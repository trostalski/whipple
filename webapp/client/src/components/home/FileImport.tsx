import axios from "axios";
import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { toastPromise } from "../toasts";

export type Metadata = {
  title?: string;
  description?: string;
};

interface FileImportProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileImport = (props: FileImportProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [datasetData, setDatasetData] = useState<Metadata>({
    title: "",
    description: "",
  });
  const workspaceId = localStorage.getItem("workspaceId");
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    (fileData: string) => {
      const data = axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/resources/bundle`,
        {
          bundle: fileData,
          dataset: datasetData,
        }
      );
      toastPromise(
        data,
        "Uploading file...",
        "File uploaded successfully!",
        "Error uploading file!"
      );
      return data;
    },
    {
      onSuccess: () => {
        console.log("invalidating queries");
        queryClient.invalidateQueries("datasets");
      },
    }
  );

  const handleSubmit = () => {
    if (files == null) {
      return;
    }
    Array.from(files).forEach((file) => {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      let fileData: string;
      fileReader.onload = async (e) => {
        fileData = JSON.parse(e.target!.result as string);
        const res = await mutateAsync(fileData);
        await res;
      };
    });
    setFiles(null);
    props.setShow(false);
  };

  const handleCancel = () => {
    setFiles(null);
    props.setShow(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="text-sm font-light"> Title</label>
        <input
          className="w-full h-10 border-gray-200 border-2 border-solid rounded-md p-2 focus:outline-blue-400"
          id="title"
          type="text"
          placeholder="Title of the dataset"
          value={datasetData?.title}
          onChange={(e) => {
            setDatasetData({ ...datasetData, title: e.target.value });
          }}
        />
      </div>
      <div className="mb-4">
        <label className="text-sm font-light">Description</label>
        <textarea
          id="description"
          rows={4}
          className="w-full border-gray-200 resize-none border-2 border-solid rounded-md p-2 focus:outline-blue-400"
          placeholder="Description of the dataset"
          value={datasetData?.description}
          onChange={(e) => {
            setDatasetData({ ...datasetData, description: e.target.value });
          }}
        ></textarea>
      </div>
      <div className="flex relative flex-col grow items-center justify-center w-full">
      <label className="text-sm font-light self-start">Selected Files</label>
        <label className="flex overflow-scroll flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="self-start place-self-start justify-self-start">
            {!files
              ? null
              : Array.from(files).map((file, idx) => (
                  <p key={idx} className="text-gray-600">
                    {file.name}
                  </p>
                ))}
          </div>
          {!files ? (
            <div className="flex absolute flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Click to upload JSON Bundle
                </span>
              </p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                or drag and drop
              </p> */}
            </div>
          ) : null}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              setFiles(e.target.files!);
            }}
          />
        </label>
      </div>
      <div className="flex mt-4 gap-8 self-end justify-end w-full">
        <button
          className="text-red-400 w-24 rounded-md p-2 hover:text-red-600"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="text-blue-500 w-24 rounded-md p-2 hover:text-blue-600"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileImport;
