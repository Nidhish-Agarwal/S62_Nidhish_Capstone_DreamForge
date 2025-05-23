import { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaGlobe,
  FaMoon,
  FaTrophy,
  FaQuestionCircle,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBar({ currentPath }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const [user, setUser] = useState({});
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/user/get_user_data", {
          signal: controller.signal,
        });
        // console.log(response.data);
        isMounted && setUser(response.data.user);
      } catch (err) {
        // console.error(err);
        if (axios.isCancel(err)) {
          console.log("Request was canceled:", err.message);
        } else if (err.response?.status === 403) {
          console.log("You do not have permission to view this content.");
        } else {
          console.error("API Error:", err.message);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className={cn(
          "fixed md:static w-56 top-0 left-0 h-screen bg-white/10 border-r border-white/20 md:bg-transparent z-50 transition-transform duration-300 font-Jaldi dark:text-white",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full p-6">
          <button
            className="md:hidden text-gray-300 self-end text-4xl hover:text-white absolute top-1 left-5"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>

          <div className="flex items-center mb-6">
            <Avatar className="w-14 h-14">
              <AvatarImage src={user.profileImage} alt="Profile Picture" />
              <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
                {user?.username
                  ? user.username
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl ml-4 truncate overflow-hidden whitespace-nowrap">
              {user.username}
            </h2>
          </div>

          <nav className="space-y-2">
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
              disabled
              tooltip="Coming soon!"
            />
          </nav>

          <hr className="my-2 dark:border-white/20 border-black" />

          <nav className="space-y-2">
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
          </nav>

          <div className="mt-auto">
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div className="flex w-full items-center px-4 py-3 rounded-lg text-gray-700 transition dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 cursor-pointer">
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
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>

      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed top-4 left-4 md:hidden z-50 text-gray-200 hover:text-white focus:outline-none",
          {
            hidden: isOpen,
          }
        )}
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
  const content = (
    <Link
      to={disabled ? "#" : `/${pathName}`}
      className={cn(
        "flex items-center px-4 py-3 rounded-lg transition",
        "text-gray-700 dark:text-gray-200",
        {
          "opacity-50 cursor-not-allowed pointer-events-none": disabled,
          "dark:bg-white/20 bg-[#FC607F] text-white shadow-lg":
            currentPath.includes(pathName),
          "dark:hover:bg-white/10 hover:bg-white/20":
            !currentPath.includes(pathName),
        }
      )}
    >
      <span className="text-sm mr-2">{icon}</span>
      {text}
      {disabled && (
        <span className="ml-1" role="img" aria-label="disabled">
          🚫
        </span>
      )}
    </Link>
  );

  return (
    <li className="list-none">
      {disabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        content
      )}
    </li>
  );
}
