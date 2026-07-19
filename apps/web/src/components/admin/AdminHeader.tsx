"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, ExternalLink } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import FullScreenToggle from "./FullScreenToggle";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

export default function AdminHeader({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isSheetOpen,
  setIsSheetOpen,
}: HeaderProps) {
  return (
    <header className="sm:pt-6 pt-3 sm:px-6 px-3 backdrop-blur rounded-b-md w-full sticky top-0 z-40">
      <div className="bg-white dark:bg-[#191B1F] w-full sm:px-6 px-3 rounded-md border border-default shadow">
        <div className="flex justify-between items-center gap-5 h-[70px]">
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="xl:block hidden cursor-pointer"
            >
              <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div
                  className={cn(
                    "bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left delay-75",
                    isSidebarCollapsed && "rotate-[42deg] w-[11px]"
                  )}
                ></div>
                <div
                  className={cn(
                    "bg-slate-800 dark:bg-slate-200 h-0.5 w-5 rounded transform transition-all duration-300",
                    isSidebarCollapsed && "opacity-0 translate-x-3"
                  )}
                ></div>
                <div
                  className={cn(
                    "bg-slate-800 dark:bg-slate-200 h-0.5 transform transition-all duration-300 origin-left delay-75",
                    isSidebarCollapsed && "-rotate-[42deg] w-[11px]"
                  )}
                ></div>
              </div>
            </button>
            <button onClick={() => setIsSheetOpen(true)} className="xl:hidden">
              <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300 origin-center overflow-hidden rotate-180">
                <div
                  className={`bg-[#1e293b] dark:bg-[#e2e8f0] h-0.5 transform transition-all duration-300 origin-left delay-150 ${isSheetOpen && "rotate-42 w-[11px]"}`}
                ></div>
                <div
                  className={`bg-[#1e293b] dark:bg-[#e2e8f0] h-0.5 w-7 rounded transform transition-all duration-300 ${isSheetOpen && "hidden"}`}
                ></div>
                <div
                  className={`bg-[#1e293b] dark:bg-[#e2e8f0] h-0.5 transform transition-all duration-300 origin-left delay-150 ${isSheetOpen && "-rotate-43 w-[11px]"}`}
                ></div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-2 h-[70px]">
            <FullScreenToggle />
            <ThemeSwitcher />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
