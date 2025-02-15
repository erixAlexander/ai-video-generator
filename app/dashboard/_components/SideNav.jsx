"use client";
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SideNav() {
  const pathName = usePathname();
  const menuOptions = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: FileVideo,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/dashboard/upgrade",
      icon: ShieldPlus,
    },
  ];
  return (
    <div className="w-64 h-screen p-5 shadow-md">
      <div className="grid gap-2">
        {menuOptions.map((item) => {
          return (
            <Link href={item.path} key={item.id}>
              <div
                className={`flex items-center p-3 gap-3 hover:bg-primary hover:text-white hover:cursor-pointer rounded-md ${
                  pathName === item.path && "bg-primary text-white"
                }`}
              >
                <item.icon />
                <h2>{item.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SideNav;
