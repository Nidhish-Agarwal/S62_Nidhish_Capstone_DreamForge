import React from "react";
import RandomStars from "../components/RandomStars";
import ShootingStars from "../components/ShootingStars";
import SideBar from "../components/Navigation/SideBar";
import TopBar from "../components/Navigation/TopBar";
import cloud from "../assets/cloud_2.png";
import sun from "../assets/sun.png";
import moon from "../assets/moon.png";
import { useLocation } from "react-router-dom";

function MainLayout({ children }) {
  const location = useLocation();
  return (
    <div className="flex items-start ">
      {/* background color fixed */}
      <div className="w-screen h-screen fixed  bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]  dark:bg-gradient-to-b dark:from-[#1a1a40] dark:to-[#0f0f33] -z-50"></div>
      {/* Light Mode background effects */}
      <div className="dark:hidden fixed h-screen w-screen -z-50">
        {/* dreamy gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcd6f6] to-[#c2e9fb]"></div>

        {/* subtle blur glow */}
        <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[200px] h-[200px] bg-blue-200 rounded-full blur-3xl opacity-30"></div>

        {/* dreamy clouds */}
        <img
          src={cloud}
          alt="Cloud 1"
          className="absolute top-[25%] left-[8%] w-[20vw] opacity-60 animate-float-slow"
        />
        <img
          src={cloud}
          alt="Cloud 2"
          className="absolute top-[50%] right-[10%] w-[25vw] opacity-50 animate-float-medium"
        />

        {/* sun glow */}
        <img
          src={sun}
          alt="Sun"
          className="absolute top-[5%] right-[5%] w-[8vw] drop-shadow-2xl opacity-80 mix-blend-screen"
        />
      </div>
      {/* Dark mode background effects */}
      <div className="fixed w-screen h-screen hidden dark:block -z-50">
        <RandomStars />
        <ShootingStars />
        <img
          src={moon}
          alt="Moon"
          className="absolute top-[20%] right-[5%] w-[12vw] drop-shadow-md transform scale-x-[-1] opacity-80"
        />
      </div>

      {/* Side Bar */}
      <div className="fixed z-20 md:z-0">
        {/* <RandomStars /> */}
        <SideBar currentPath={location.pathname} />
      </div>

      <div className="flex-1 flex flex-col md:ml-52 ml-5 h-screen">
        {/* Top Bar */}
        <div className="fixed md:left-52 w-[calc(100%-0.5rem)] md:w-[calc(100%-13rem)] overflow-visible overlay-open:z-0 z-10">
          <TopBar currentPath={location.pathname} />
        </div>

        {/* Main Content */}

        <div className="mt-36 md:mt-20  max-h-[calc(100%-4rem) max-h-full relative overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
