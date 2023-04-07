import React from "react";
import Wrapper from "../components/Wrapper";

const Analytics = () => {
  return (
    <Wrapper>
      <div className="h-full w-full flex flex-col text-xs p-4 overflow-scroll">
        <div className="flex flex-row items-center w-full h-12 text-md">
          <p className="grow text-lg font-extralight">Analytics</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Analytics;
