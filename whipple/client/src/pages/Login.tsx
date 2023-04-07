import axios from "axios";
import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toastError } from "../components/toasts";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: () => {
      return axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/login`,
        {
          username,
          password,
        }
      );
    },
    onError: () => {
      toastError("Invalid username or password.");
    },
    onSuccess: (data) => {
      navigate("/workspaces");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      toastError("Please fill in all fields");
    } else {
      mutate();
    }
  };
  return (
    <div className="container mx-auto h-full w-full">
      <div className="flex flex-col pb-24 w-full h-full justify-center items-center gap-4">
        <div className="flex flex-col h-72 w-1/3 bg-white p-4 rounded-xl shadow-xl">
          <span className="text-gray-500 text-center text-2xl font-bold">
            Login
          </span>
          <form onSubmit={handleSubmit}>
            <div className="h-full w-full grow-1">
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 bg-white p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 bg-white p-2 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 items-center">
              <Link to={"/"} className="gray-400 hover:underline">
                Back
              </Link>
              <button
                className="bg-blue-400 text-center rounded-xl shadow-md py-2 px-6 text-white hover:scale-105 hover:bg-blue-600"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
