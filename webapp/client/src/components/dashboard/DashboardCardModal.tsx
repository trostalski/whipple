import axios from "axios";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import Select from "react-select";
import { workspaceIdString } from "../../constants";
import { useDatasets } from "../../hooks/useDatasets";
import { useDistinctObservationNames } from "../../hooks/useDistinctObservationNames";
import { useWorkspaceIds } from "../../hooks/useWorkspaceIds";
import { OptionType, ServerPostResponse } from "../../types";
import ModalWrapper from "../ModalWrapper";
import { toastError } from "../toasts";
import {
  subjectOptions,
  contentOptions,
  avaliableChartTypes,
} from "./constants";
import { getTargetOptions } from "./DashboardCard";
import { cardInputIsValid } from "./utils";

interface DashboardCardModalProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  inputData: InputData;
  mode: "create" | "edit";
  targetOptions: OptionType[];
  specimenOptions: OptionType[];
  cardId?: string;
}

export type InputData = {
  title: string;
  info: string;
  subject: "dataset" | "patient";
  targets: string[];
  content: string;
  specimen: string;
  chart_type: string;
};

const DashboardCardModal = (props: DashboardCardModalProps) => {
  const workspaceId = localStorage.getItem(workspaceIdString);
  const queryClient = useQueryClient();
  const [inputData, setInputData] = React.useState<InputData>(props.inputData);

  const [targetOptions, setTargetOptions] = React.useState<OptionType[]>(
    props.targetOptions
  );
  const [specimenOptions, setSpecimenOptions] = React.useState<OptionType[]>(
    props.specimenOptions
  );

  const { data: patientIds } = useWorkspaceIds(workspaceId!, "Patient");
  const { data: datasets } = useDatasets(workspaceId!);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const { mutate: createMutate, data: createData } = useMutation(
    () => {
      const data = axios.post<ServerPostResponse>(
        `${process.env.REACT_APP_SERVER_URL}/${workspaceIdString}/workspaces/${workspaceId}/dashboard_cards/`,
        inputData
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dashboard_cards");
        if (createData?.data.response == false) {
          toastError(createData.data.message);
        } else {
          props.setShow(false);
        }
      },
    }
  );

  const { mutate: updateMutate, data: updateData } = useMutation(
    () => {
      const data = axios.post<ServerPostResponse>(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/workspaces/${workspaceId}/dashboard_cards/${props.cardId}`,
        inputData
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dashboard_cards");
        if (updateData?.data.response == false) {
          toastError(updateData.data.message);
        } else {
          props.setShow(false);
        }
      },
    }
  );

  const { data: distinctObservationNames } = useDistinctObservationNames(
    workspaceId!
  );

  // set target options
  useEffect(() => {
    const subject = inputData.subject;
    const targetOptions = getTargetOptions(subject, datasets!, patientIds!);
    if (targetOptions.length > 0) {
      setTargetOptions(targetOptions!);
    }
  }, [inputData.subject, datasets, patientIds]);

  // set specimen options
  useEffect(() => {
    const content = inputData.content;
    let specimenOptions: OptionType[] = [];
    if (content === "Observation") {
      if (distinctObservationNames === undefined) return;
      specimenOptions = distinctObservationNames.map((name) => {
        return { value: name, label: name };
      });
    }
    if (specimenOptions.length > 0) {
      setSpecimenOptions(specimenOptions!);
    }
  }, [inputData.content]);

  const handleCreate = () => {
    if (cardInputIsValid(inputData)) {
      createMutate();
    }
  };

  const handleUpdate = () => {
    if (cardInputIsValid(inputData)) {
      updateMutate();
    }
  };
  console.log(targetOptions);
  console.log(inputData);
  return (
    <ModalWrapper setShow={props.setShow}>
      <div className="flex flex-col h-full gap-6">
        <div className="">
          <h3 className="text-lg font-light">Create Card</h3>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label className="text-sm font-light">Title</label>
            <input
              value={inputData.title}
              name="title"
              placeholder="Title"
              className="w-full h-10 border-gray-200 border-2 border-solid rounded-md p-2 focus:outline-blue-400"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-light">Info</label>
            <textarea
              name="info"
              value={inputData.info}
              placeholder="Info"
              className="w-full h-10 border-gray-200 resize-none border-2 border-solid rounded-md p-2 focus:outline-blue-400"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label className="text-sm font-light">Subject</label>
            <Select
              name="subject"
              options={subjectOptions}
              defaultValue={subjectOptions.filter(
                (option) => option.value === inputData.subject
              )}
              onChange={(e: any) =>
                setInputData({ ...inputData, subject: e.value })
              }
              placeholder={"Dataset"}
            ></Select>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-light">Targets</label>
            <Select
              isMulti
              name="targets"
              options={targetOptions}
              defaultValue={targetOptions.filter((option) =>
                inputData.targets.includes(option.value.toString())
              )}
              onChange={(e: any) =>
                setInputData({
                  ...inputData,
                  targets: e.map((e: any) => e.value),
                })
              }
              placeholder={inputData.subject}
            ></Select>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label className="text-sm font-light">Content</label>
            <Select
              name="content"
              options={contentOptions}
              defaultValue={contentOptions.filter(
                (option) => option.value === inputData.content
              )}
              onChange={(e: any) =>
                setInputData({ ...inputData, content: e.value })
              }
              placeholder={"Resource"}
            ></Select>
          </div>
          <div className="w-1/2">
            {inputData.content === "Observation" ? (
              <>
                <label className="text-sm font-light">Specimen</label>
                <Select
                  name="specimen"
                  options={specimenOptions}
                  defaultValue={specimenOptions.filter(
                    (option) => option.value === inputData.specimen
                  )}
                  onChange={(e: any) =>
                    setInputData({ ...inputData, specimen: e.value })
                  }
                ></Select>
              </>
            ) : null}
          </div>
        </div>
        <div>
          <label className="text-sm font-light">Chart Type</label>
          <div className="flex flex-row justify-start items-center gap-2">
            {avaliableChartTypes
              .filter((chartType) =>
                chartType.contents.includes(inputData.content)
              )
              .map((chartType) => (
                <button
                  name="chart_type"
                  key={chartType.value}
                  className={`shadow-md rounded-md py-1 px-4 text-white hover:bg-blue-600 ${
                    inputData.chart_type === chartType.value
                      ? "bg-blue-500"
                      : "bg-blue-300"
                  }`}
                  onClick={(e) => {
                    setInputData({ ...inputData, chart_type: chartType.value });
                  }}
                >
                  {chartType.label}
                </button>
              ))}
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-row gap-4 mt-4">
          <div className="flex-grow" />
          <button
            className="text-red-400 w-32 rounded-md p-2 hover:text-red-600"
            onClick={() => {
              setInputData(props.inputData);
              props.setShow(false);
            }}
          >
            Cancel
          </button>
          {props.mode === "edit" ? (
            <button
              className="text-blue-500 w-32 rounded-md p-2 hover:text-blue-600"
              onClick={handleUpdate}
            >
              Update Card
            </button>
          ) : (
            <button
              className="text-blue-500 w-32 rounded-md p-2 hover:text-blue-600"
              onClick={handleCreate}
            >
              Create Card
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DashboardCardModal;
