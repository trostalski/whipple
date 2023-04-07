import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";

const LogoutButton = () => {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: () => {
      return axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`);
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  return (
    <div>
      <button
        className="flex text-start w-full items-center p-2 text-xs font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => {
          navigate("/");
          // mutate();
          // localStorage.removeItem("user");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
        <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton;
