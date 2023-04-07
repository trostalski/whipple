import React, { useState } from "react";
import { useNavigate } from "react-router";
import AddIcon from "../icons/AddIcon";
import DeleteIcon from "../icons/DeleteIcon";

interface NewDatasetModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}

interface DatasetInfoProps {
  setOpenSelectData: (openSelectData: boolean) => void;
  setOpenModal: (openModal: boolean) => void;
}

const DatasetInfo = (props: DatasetInfoProps) => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl">New Dataset</h1>
        <input placeholder="Name" className="border-2 rounded-xl p-2" />
        <input placeholder="Description" className="border-2 rounded-xl p-2" />
        <input placeholder="Tags" className="border-2 rounded-xl p-2" />
      </div>
      <div className="absolute bottom-6 right-6 flex justify-end gap-4">
        <button
          className="bg-gray-100 rounded-xl py-2 px-6 hover:bg-gray-200"
          onClick={() => {
            props.setOpenModal(false);
          }}
        >
          Close
        </button>
        <button
          className="bg-blue-400 rounded-xl py-2 px-2 hover:bg-blue-600 text-white"
          onClick={() => {
            props.setOpenSelectData(true);
          }}
        >
          Select Data
        </button>
      </div>
    </>
  );
};

interface DatasetSelectionProps {
  setOpenSelectData: (openSelectData: boolean) => void;
  setOpenModal: (openModal: boolean) => void;
}

const DatasetSelection = (props: DatasetSelectionProps) => {
  const [selection, setSelection] = useState<string[]>([]);
  const [idInput, setIdInput] = useState<string>("");
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-xl">Select Data</h1>
        <div className="flex items-center w-full">
          <input
            placeholder="Add ID"
            className="grow border-2 rounded-xl p-2"
            value={idInput}
            onChange={(e) => {
              setIdInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSelection([...selection, idInput]);
                setIdInput("");
              }
            }}
          />
          <button
            onClick={() => {
              setSelection([...selection, idInput]);
              setIdInput("");
            }}
          >
            <AddIcon />
          </button>
        </div>
        <button
          className="bg-blue-400 rounded-md p-2 text-white hover:bg-blue-600"
          onClick={() => navigate("/search")}
        >
          Add data from Search
        </button>
        <hr />
        <div>
          <div className=" w-full h-8 overflow-auto overflow-y-auto flex flex-row gap-2 text-xs">
            {!selection
              ? null
              : selection.map((id, index) => (
                  <div className="flex flex-row">
                    <p key={index} className="bg-gray-100 rounded-xl p-2">
                      {id}
                    </p>
                    <button
                      onClick={() => {
                        setSelection(selection.filter((item) => item !== id));
                      }}
                    >
                      <DeleteIcon xs />
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex justify-end gap-4">
        <button
          className="bg-gray-100 rounded-xl py-2 px-6 hover:bg-gray-200"
          onClick={() => {
            props.setOpenSelectData(false);
          }}
        >
          Back
        </button>
        <button
          className="bg-blue-400 rounded-xl py-2 px-2 hover:bg-blue-600 text-white"
          onClick={() => {}}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

const NewDatasetModal = (props: NewDatasetModalProps) => {
  const [openSelectData, setOpenSelectData] = useState(false);

  return (
    <div>
      {props.openModal ? (
        <div
          className="fixed top-16 bg-black bg-opacity-20 w-screen h-screen z-10"
          onClick={() => {
            props.setOpenModal(false);
          }}
        >
          <div
            className="bg-white p-6 w-1/3 h-1/2 rounded-xl relative top-72 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            {!openSelectData ? (
              <DatasetInfo
                setOpenModal={props.setOpenModal}
                setOpenSelectData={setOpenSelectData}
              />
            ) : (
              <DatasetSelection
                setOpenModal={props.setOpenModal}
                setOpenSelectData={setOpenSelectData}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NewDatasetModal;
