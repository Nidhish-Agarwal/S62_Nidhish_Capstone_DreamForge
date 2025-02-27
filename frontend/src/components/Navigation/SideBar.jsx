import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaGlobe,
  FaMoon,
  FaTrophy,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function SideBar({ currentPath }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();

  const handleLogout = async () => {
    setIsOpen(false);
    // Add logout logic here (e.g., API call, auth reset)
    console.log("User logged out!");
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* Overlay for smaller screen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-screen backdrop-blur-lg bg-white/10 border-r border-white/20 md:bg-transparent md:translate-x-0 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6 font-Jaldi dark:text-white ">
          {/* X button visible on smaller screens */}
          <button
            className="md:hidden text-gray-300 self-end text-4xl hover:text-white absolute top-1 left-5"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          {/* User Profile */}
          <div className="flex items-center mb-6">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Profile"
              className="w-14 h-14 rounded-full border border-white/30"
            />
            <div className="ml-4">
              <h2 className="text-xl ">John Smith</h2>
              <p className="text-xs dark:text-gray-300 text-gray-500">
                Spooky Dreamer
              </p>
            </div>
          </div>
          {/* Nav items */}
          <nav>
            <ul className="space-y-2">
              <NavItem
                icon={<FaHome />}
                text="Dashboard"
                pathName="dashboard"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaMoon />}
                text="My Dreams"
                pathName="mydreams"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaGlobe />}
                text="Community"
                pathName="community"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaTrophy />}
                text="Gamification"
                pathName="gamification"
                currentPath={currentPath}
                disabled={true}
                tooltip="Coming soon!"
              />
            </ul>
          </nav>

          <hr className="my-2 dark:border-white/20 border-black" />

          <ul className="space-y-2">
            <NavItem
              icon={<FaUser />}
              text="Profile"
              pathName="profile"
              currentPath={currentPath}
            />
            <NavItem
              icon={<FaQuestionCircle />}
              text="Help"
              pathName="help"
              currentPath={currentPath}
            />
          </ul>

          {/* <ul className="mt-auto">
            <NavItem
              icon={<FaSignOutAlt />}
              text="Logout"
              pathName="logout"
              currentPath={currentPath}
            />
          </ul> */}
          <ul className="mt-auto">
            <li className="relative group">
              <AlertDialog>
                <AlertDialogTrigger className="w-full">
                  <div
                    onClick={() => setIsLogoutOpen(true)}
                    className="flex w-full items-center px-4 py-3 rounded-lg text-gray-700 transition dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <span className="text-sm mr-2">
                      <FaSignOutAlt />
                    </span>
                    Logout
                  </div>
                </AlertDialogTrigger>

                <AlertDialogContent className="dark:bg-white/10 backdrop-blur-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">
                      Confirm Logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure that you want to Logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          </ul>
        </div>
      </div>
      {/* Hamburger menu visible on smaller screens */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`fixed top-4 left-4 md:hidden z-50 text-gray-200 hover:text-white focus:outline-none ${
          isOpen ? "hidden" : ""
        }`}
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </>
  );
}

function NavItem({ icon, text, pathName, currentPath, disabled, tooltip }) {
  return (
    <li className="relative group">
      <Link
        to={disabled ? "#" : `/${pathName}`}
        className={`flex items-center px-4 py-3 rounded-lg text-gray-700 transition dark:text-gray-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : currentPath.includes(pathName)
            ? "dark:bg-white/20 bg-[#FC607F] text-white backdrop-blur-md shadow-lg"
            : "dark:hover:bg-white/10 hover:bg-white/20"
        }`}
      >
        <span className="text-sm mr-2">{icon}</span>
        {text}
      </Link>

      {/* Tooltip for disabled state */}
      {disabled && tooltip && (
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {tooltip}
        </span>
      )}
    </li>
  );
}
