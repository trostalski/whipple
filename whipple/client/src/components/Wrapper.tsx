import React from "react";
import Sidebar from "./Sidebar";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <Sidebar />
      <div className="container mx-auto h-full w-full p-8 overflow-y-scroll overflow-x-clip">
        {children}
      </div>
    </>
  );
};

export default Wrapper;
