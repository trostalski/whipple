import React from "react";
import ModalWrapper from "../ModalWrapper";
import FileImport from "./FileImport";

interface DatasetImportModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportDataModal = (
  method: string,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let modalElement;
  switch (method) {
    case "File":
      modalElement = <FileImport setShow={setShow} />;
      break;
    default:
      break;
  }

  return modalElement;
};

const DatasetImportModal = (props: DatasetImportModalProps) => {
  const availableImportMethods = ["File"];
  const [importMethod, setImportMethod] = React.useState<string>(
    availableImportMethods[0]
  );
  return (
    <ModalWrapper setShow={props.setShow} size="lg">
      <div className="flex flex-col">
        <div className="flex flex-row mb-4 w-full h-8 justify-between">
          {availableImportMethods.map((method) => (
            <button
              key={method}
              className={`${
                importMethod === method
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              } w-48 shadow-md rounded-md py-2 px-6 hover:font-bold`}
              onClick={() => setImportMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
        {ImportDataModal(importMethod, props.setShow)}
      </div>
    </ModalWrapper>
  );
};

export default DatasetImportModal;
