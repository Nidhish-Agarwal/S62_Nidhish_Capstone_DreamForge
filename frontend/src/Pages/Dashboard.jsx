import DashboardTabs from "../components/Dashboard/DashboardTabs";
import DashboardHeader from "../components/Dashboard/Header/DashboardHeader";
import DashboardLeftColumn from "../components/Dashboard/LeftColumn/DashboardLeftColumn";
import DashboardRightColumn from "../components/Dashboard/RightColumn/DashboardRightColumn";

function Dashboard() {
  return (
    <div className="p-4">
      <DashboardHeader />
      <DashboardTabs />
    </div>
  );
}

export default Dashboard;
