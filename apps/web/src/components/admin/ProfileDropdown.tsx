"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa";
import { PiPower } from "react-icons/pi";

export default function ProfileDropdown() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!user) return null;

  const initials = user?.firstName
    ? user.firstName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="size-10 flex items-center justify-center border-2 border-default rounded-full">
          <FaUserAstronaut />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 p-2" align="end">
        {/* User Info */}
        <DropdownMenuLabel className="flex gap-3 items-center p-3">
          <div className="size-10 flex items-center justify-center border-2 border-default rounded-full shrink-0">
            <FaUserAstronaut />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#1e293b] dark:text-[#e2e8f0] capitalize">
              {user?.firstName} {user?.lastName}
            </span>
            <Link
              href={`mailto:${user?.email}`}
              className="text-xs text-[#475569] dark:text-[#94a3b8] hover:text-primary dark:hover:text-primary"
            >
              {user?.email}
            </Link>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <Link href={user.role === "ADMIN" ? "/dashboard/profile" : "/profile"} className="cursor-pointer">
            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-[#475569] dark:text-[#94a3b8] capitalize px-3 py-1.5 hover:bg-[#e2e8f0]! dark:hover:bg-[#334155]! cursor-pointer">
              <User />
              Profile
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-[#475569] dark:text-[#94a3b8] capitalize my-1 px-3 hover:bg-[#e2e8f0]! dark:hover:bg-[#334155]! cursor-pointer"
        >
          <PiPower />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
