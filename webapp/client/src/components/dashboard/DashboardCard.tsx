import React, { useEffect } from "react";
import {
  DashboardCardData,
  useDashboardCardDataset,
} from "../../hooks/useDashboardCardDataset";
import { DashboardCardInfo } from "../../hooks/useDashboardCards";
import DashboardPieChart from "./DashboardPieChart";
import { GoKebabVertical } from "react-icons/go";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toastSuccess } from "../toasts";
import DashboardBarChart from "./DashboardBarChart";
import DashboardLineChart from "./DashboardLineChart";
import DashboardBoxplotChart from "./DashboardBoxplotChart";
import DashboardCardModal from "./DashboardCardModal";
import { apiV1, workspaceIdString } from "../../constants";
import { OptionType } from "../../types";
import { Dataset, useDatasets } from "../../hooks/useDatasets";
import { useWorkspaceIds } from "../../hooks/useWorkspaceIds";
import { useDistinctObservationNames } from "../../hooks/useDistinctObservationNames";

interface DashboardCardProps {
  cardData: DashboardCardInfo;
}

const CardChart = (chartType: string, data: DashboardCardData) => {
  switch (chartType) {
    case "pie":
      return <DashboardPieChart data={data} />;
      break;
    case "bar":
      return <DashboardBarChart data={data} />;
    case "line":
      return <DashboardLineChart data={data} />;
    case "boxplot":
      return <DashboardBoxplotChart data={data} />;
    default:
      break;
  }
};

export const getSpecimenOptions = (
  content: string,
  distincObservationNames: string[] | undefined
) => {
  let result: OptionType[] = [{ value: "", label: "" }];

  if (!distincObservationNames) return result;

  if (content === "Observation") {
    result = distincObservationNames
      .sort((a, b) => (a > b ? 1 : -1))
      .map((name) => {
        return { value: name, label: name };
      });
  }
  return result;
};

export const getTargetOptions = (
  subject: string,
  datasets: Dataset[] | undefined,
  patientIds: string[] | undefined
) => {
  let result: OptionType[] = [{ value: "", label: "" }];

  if (!datasets || !patientIds) return result;

  if (subject === "dataset") {
    console.log(datasets);
    result = datasets.map((dataset) => {
      return { value: dataset.id, label: dataset.title };
    });
  } else if (subject === "patient") {
    result = patientIds.map((patientId) => {
      return { value: patientId, label: patientId };
    });
  }
  return result;
};

const DashboardCard = (props: DashboardCardProps) => {
  const workspaceId = localStorage.getItem(workspaceIdString);
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = React.useState(false);
  const [cardModalIsOpen, setCardModalIsOpen] = React.useState(false);

  const { data: datasets } = useDatasets(workspaceId!);
  const { data: patientIds } = useWorkspaceIds(workspaceId!, "Patient");

  const { data: distinctObservationNames } = useDistinctObservationNames(
    workspaceId!
  );

  let targetOptions, specimenOptions;

  targetOptions = getTargetOptions(
    props.cardData.subject,
    datasets,
    patientIds
  );

  specimenOptions = getSpecimenOptions(
    props.cardData.content,
    distinctObservationNames
  );

  const { data, isError, isLoading } = useDashboardCardDataset(
    workspaceId!,
    props.cardData.id
  );

  const { mutate: deleteMutate } = useMutation(
    () => {
      return axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/${apiV1}/workspaces/${workspaceId}/dashboard_cards/${props.cardData.id}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dashboard_cards");
        toastSuccess("Card Deleted Successfully");
      },
    }
  );

  useEffect(() => {
    document.addEventListener("click", () => {
      setShowMenu(false);
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div
      className="flex flex-row justify-between relative bg-white shadow-md rounded-md"
      onClick={() => {
        setShowMenu(false);
      }}
    >
      <div className="w-48 pl-2 pt-2">
        <h3 className="text-lg">{props.cardData.title}</h3>
        <p className="text-gray-400">{props.cardData.info}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        {!data || data.datasets.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-400">No Data Found.</p>
          </div>
        ) : (
          CardChart(props.cardData.chart_type, data!)
        )}
      </div>
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <GoKebabVertical size={"20px"} />
        </button>
        <div
          className={`absolute  w-20 bg-white p-4 shadow-xl z-10 rounded-xl mt-2 right-0 top-8 ${
            showMenu ? "display" : "hidden"
          }`}
        >
          <ul className="flex flex-col items-end space-y-2 list-inside">
            <li>
              <button
                className="hover:underline"
                onClick={(e) => {
                  setShowMenu(false);
                  setCardModalIsOpen(!cardModalIsOpen);
                }}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                className="hover:underline"
                onClick={() => {
                  setShowMenu(false);
                  deleteMutate();
                }}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      {cardModalIsOpen ? (
        <DashboardCardModal
          setShow={setCardModalIsOpen}
          mode="edit"
          inputData={props.cardData}
          cardId={props.cardData.id}
          targetOptions={targetOptions}
          specimenOptions={specimenOptions}
        />
      ) : null}
    </div>
  );
};

export default DashboardCard;
