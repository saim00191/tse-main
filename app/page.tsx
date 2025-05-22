import CreditTokenWrapper from "@/components/Credit-Token-Wrapper";
import Dashboard_Overview from "@/components/Dashboard";
import AuthWrapper from "./admin-login/Auth-Wrapper";
import React from "react";

const Dashboard = () => {

  return (
    <AuthWrapper>
      <div className="w-full flex flex-col gap-4 bg-gradient-to-b from-white via-purple-50 to-indigo-100 min-h-screen p-4">
        <Dashboard_Overview />
        <CreditTokenWrapper />
      </div>
    </AuthWrapper>
  );
};

export default Dashboard;
