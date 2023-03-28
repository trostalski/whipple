import React from "react";
import { Link } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import LogoutButton from "./buttons/LogoutButton";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IconContext } from "react-icons";
import { BiHomeAlt } from "react-icons/bi";
import { AiOutlineDatabase } from "react-icons/ai";
import { GrAnalytics } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";
import { BsPeople } from "react-icons/bs";
import { CiExport } from "react-icons/ci";

const Sidebar = () => {
  const { data: workspace, isLoading, error } = useWorkspace();
  const [isOpen, setIsOpen] = React.useState(true);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const Drawer = () => {
    return (
      <aside className="z-20 w-44 h-full px-2 py-2 overflow-y-auto shadow-md rounded bg-white">
        <div className="flex w-full justify-end py-2">
          <button onClick={() => setIsOpen(!isOpen)}>
            <RxHamburgerMenu />
          </button>
        </div>
        <div className="flex w-full h-12 justify-center items-start">
          {isLoading ? (
            <p>Is Loading…</p>
          ) : (
            <Link to={"/workspaces"} className="font-extralight">
              {workspace?.title}
            </Link>
          )}
        </div>
        <ul className="space-y-8 w-full">
          <Link
            to={"/datasets"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <AiOutlineDatabase size={"20px"} />
            <span className="ml-3">Datasets</span>
          </Link>
          <Link
            to={"/dashboard"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MdOutlineDashboardCustomize size={"20"} />
            <span className="ml-3">Dashboard</span>
          </Link>
          {/* <Link
          to={"/search"}
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className="flex-1 ml-3 whitespace-nowrap">Search</span>
        </Link> */}
          {/* <Link
            to={"/explorer"}
            className="flex items-center p-2 text-xs font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="flex-1 ml-3 whitespace-nowrap">
              Resource Explorer
            </span>
          </Link> */}
          <Link
            to={"/patients"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BsPeople size={"20"} />
            <span className="ml-3">Patients</span>
          </Link>
          {/* <Link
            to={"/analytics"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <GrAnalytics size={"20"} />
            <span className="flex-1 ml-3 whitespace-nowrap">Analytics</span>
          </Link>
          <Link
            to={"/exports"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <CiExport size={"24"} />
            <span className="flex-1 ml-3 whitespace-nowrap">Export</span>
          </Link>
          <Link
            to={"/settings"}
            className="flex p-2 items-center text-xs text-left text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiSettings size={"20"} />
            <span className="flex-1 ml-3 whitespace-nowrap">Settings</span>
          </Link>
          <LogoutButton /> */}
        </ul>
      </aside>
    );
  };
  return (
    <>
      {isOpen ? (
        <Drawer />
      ) : (
        <div className="fixed top-4 left-4">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
