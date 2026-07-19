"use client";

import Logo from "@/assets/logo.png";
import LogoWhite from "@/assets/logo-white.png";
import { FiUser } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import ThemeSwitcher from "./admin/ThemeSwitcher";
import ProfileDropdown from "./admin/ProfileDropdown";

export default function SecondaryHeader() {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-6 mb-24 shadow-lg shadow-gray-100 dark:shadow-none border-b border-default bg-white dark:bg-[#202123]">
      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center">
        {/* <Link href="/">
          <img
            src={Logo}
            alt="get.bd"
            className="block dark:hidden h-[40px] w-auto"
          />
          <img
            src={LogoWhite}
            alt="get.bd"
            className="dark:block hidden h-[40px] w-auto"
          />
        </Link> */}

        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl">
            🎲
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
            Diceymio
          </span>
        </Link>

        <div className="flex items-center sm:gap-4 gap-2">
          <ThemeSwitcher />
          {!user && (
            <Link
              href="/auth/login"
              className="sm:block hidden bg-card border border-default rounded-lg px-4 py-2 text-accent text-sm font-semibold shadow hover:shadow-none active:scale-95 transition-all"
            >
              Login
            </Link>
          )}
          {!user && (
            <Link
              href="/auth/signup"
              className="sm:flex hidden items-center gap-1 bg-[#3BA956] border border-default rounded-lg px-4 py-2 text-white text-sm font-semibold shadow hover:shadow-none active:scale-95 transition-all"
            >
              <FiUser />
              Sign up
            </Link>
          )}
          {user && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
