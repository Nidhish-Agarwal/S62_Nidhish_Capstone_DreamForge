import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CommunityNavigation({ currentPath }) {
  const navigate = useNavigate();
  const active = currentPath.endsWith("/all-posts")
    ? "all"
    : currentPath.endsWith("/my-posts")
    ? "mine"
    : "saved";
  return (
    <>
      {/* <ul className="flex gap-4 pl-8">
        <NavItem
          text={"All Posts"}
          pathName={"all-posts"}
          currentPath={currentPath}
        />

        <NavItem
          text={"My Posts"}
          pathName={"my-posts"}
          currentPath={currentPath}
        />

        <NavItem
          text={"BookMarks"}
          pathName={"bookmarks"}
          currentPath={currentPath}
        />
      </ul> */}

      {/* Tabs */}
      <Tabs
        value={active}
        onValueChange={(v) => {
          const map = {
            all: "all-posts",
            mine: "my-posts",
            saved: "bookmarks",
          };
          navigate(`/community/${map[v]}`);
        }}
        className="w-full pl-8"
      >
        <TabsList className="bg-white/30 backdrop-blur-md ">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white rounded-md transition-all"
          >
            All Posts
          </TabsTrigger>
          <TabsTrigger
            value="mine"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white rounded-md transition-all"
          >
            My Posts
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white dark:data-[state=active]:bg-[#0a0a0a] dark:data-[state=active]:text-white rounded-md transition-all"
          >
            Bookmarks
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}

function NavItem({ text, pathName, currentPath }) {
  const isActive =
    (pathName === "all-posts" &&
      (currentPath === "/community" ||
        currentPath === "/community/all-posts")) ||
    currentPath.includes(pathName);
  return (
    <li>
      <Link
        to={`/community/${pathName}`}
        className={`relative dark:text-gray-200  transition p-1
      after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0
      after:w-12 after:h-[3px] after:bg-red-500 after:rounded-full
      ${isActive ? "after:content-['']" : "after:content-none"}`}
      >
        {text}
      </Link>
    </li>
  );
}

export default CommunityNavigation;
