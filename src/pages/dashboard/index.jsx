import DashboardComponent from "@/component/Dashboard";
import DashboardLayout from "@/component/DashboardLayout";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  

  // console.log("Redux State:", user);
  return (
    <>
      <DashboardLayout>
        <DashboardComponent />
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
