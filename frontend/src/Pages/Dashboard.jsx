import DashboardTabs from "../components/Dashboard/DashboardTabs";
import DashboardHeader from "../components/Dashboard/Header/DashboardHeader";

function Dashboard() {
  return (
    <div className="p-4">
      <DashboardHeader />
      <DashboardTabs />
    </div>
  );
}

export default Dashboard;
