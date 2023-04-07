import React, { useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="container mx-auto h-full w-full">
      <div className="flex flex-col pb-24 w-full h-full justify-center items-center gap-4">
        <Link
          to={"/register"}
          className="bg-blue-400 text-center w-40 rounded-xl shadow-md py-2 px-6 text-white hover:scale-105 hover:bg-blue-600"
        >
          Register
        </Link>
        <Link
          to={"/login"}
          className="bg-blue-400 text-center w-40 rounded-xl shadow-md py-2 px-6 text-white hover:scale-105 hover:bg-blue-600"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Landing;
