import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import { QueryClient, QueryClientProvider } from "react-query";
import Logout from "./pages/Logout";
import { ToastContainer } from "react-toastify";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dataset from "./pages/Dataset";
import Analytics from "./pages/Analytics";
import Workspaces from "./pages/Workspaces";
import Settings from "./pages/Settings";
import Patients from "./pages/Patients";
import PatientPage from "./pages/PatientPage";
import Exports from "./pages/Exports";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-row h-screen w-screen bg-slate-50">
          <ToastContainer className="h-48 overflow-scroll" />
          <Routes>
            <Route index element={<Landing />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/dataset/:id" element={<Dataset />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/*" element={<NoPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
