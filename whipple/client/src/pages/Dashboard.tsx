import React from "react";
import {
  defaultInputData,
  defaultSpecimentOptions,
  defaultTargetOptions,
} from "../components/dashboard/constants";
import DashboardCardModal from "../components/dashboard/DashboardCardModal";
import DashboardCard from "../components/dashboard/DashboardCard";
import Wrapper from "../components/Wrapper";
import { useDashboardCards } from "../hooks/useDashboardCards";

const Dashboard = () => {
  const [cardModalIsOpen, setCardModalIsOpen] = React.useState(false);
  const workspaceId = localStorage.getItem("workspaceId");
  const { data } = useDashboardCards(workspaceId!);

  return (
    <Wrapper>
      <div className="h-full w-full flex flex-col text-xs p-4 overflow-scroll">
        <div className="flex flex-row items-center w-full h-12 text-md mb-4">
          <p className="grow text-lg font-extralight">Dashboard</p>
          <button
            data-dropdown-toggle="dropdown"
            className="bg-blue-500 w-48 shadow-md rounded-md py-2 px-6 hover:bg-blue-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setCardModalIsOpen(!cardModalIsOpen);
            }}
          >
            Add Card
          </button>
        </div>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-2 gap-8">
            {data.map((card) => {
              return <DashboardCard key={card.id} cardInfo={card} />;
            })}
          </div>
        ) : (
          <div className="flex bg-white h-12 justify-center items-center shadow-md rounded-md">
            <p>No Cards.</p>
          </div>
        )}
      </div>
      {cardModalIsOpen ? (
        <DashboardCardModal
          setShow={setCardModalIsOpen}
          mode="create"
          inputData={defaultInputData}
          specimenOptions={defaultSpecimentOptions}
          targetOptions={defaultTargetOptions}
        />
      ) : null}
    </Wrapper>
  );
};

export default Dashboard;
