import { useLocation, Outlet } from "react-router-dom";
import AddPostDrawer from "../components/overlays/AddPostDrawer";
import CommunityNavigation from "../components/Navigation/CommunityNavigation";

function CommunityPage() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-full">
      <CommunityNavigation currentPath={pathname} />

      <div className="flex-1 overflow-y-auto mt-2">
        <div className="flex justify-center">
          <Outlet />
        </div>
        <AddPostDrawer />
      </div>
    </div>
  );
}

export default CommunityPage;
