import DashboardComponent from "@/component/Dashboard";
import DashboardLayout from "@/component/DashboardLayout";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <DashboardLayout>
        <DashboardComponent />
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
