import DashboardTabs from "../components/Dashboard/DashboardTabs";
import DashboardHeader from "../components/Dashboard/Header/DashboardHeader";
import DashboardLeftColumn from "../components/Dashboard/LeftColumn/DashboardLeftColumn";
import DashboardRightColumn from "../components/Dashboard/RightColumn/DashboardRightColumn";

function Dashboard() {
  return (
    <div className="p-4">
      <DashboardHeader />
      <DashboardTabs />
      {/* <div className="flex flex-wrap">
        <div className="lg:w-1/2 w-full">
          <DashboardLeftColumn />
        </div>
        <div className="lg:w-1/2 w-full">
          <DashboardRightColumn />
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
