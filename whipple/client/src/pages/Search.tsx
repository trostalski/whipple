import React from "react";
import Wrapper from "../components/Wrapper";

const Search = () => {
  return (
    <Wrapper>
      <div className="flex flex-col bg-white h-full text-xs rounded-xl p-4 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Search</p>
              <input
                className="border border-gray-300 rounded-md p-2"
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Search;
