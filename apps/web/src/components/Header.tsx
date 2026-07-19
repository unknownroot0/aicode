"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useCartSheetStore } from "@/store/cartSheetStore";
import { useAuthStore } from "@/store/authStore";
import Logo from "../../public/images/logo.svg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/products", hasDropdown: true },
  { label: "Events", href: "/events" },
  { label: "Character", href: "/characters" },
  { label: "Support", href: "/contact" },
];

const HIDDEN_PATHS = ["/dashboard", "/auth"];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { items } = useCartStore();
  const { onOpen: openCart } = useCartSheetStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Hide on dashboard / auth pages
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const cartCount = items.length;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1C13]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-[#FFFFFF18]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="Diceymio home"
          >
            <Image src={Logo} alt="Diceymio" className="h-8 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-[#FEF5DE]"
                      : "text-[#FEF5DE99] hover:text-[#FEF5DE]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right-side Icons */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <button
              id="header-search-btn"
              aria-label="Search"
              className="size-10 flex items-center justify-center text-[#FEF5DE99] hover:text-[#FEF5DE] rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Search className="size-4.5" />
            </button>

            {/* Cart */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              aria-label="Open cart"
              className="relative size-10 flex items-center justify-center text-[#FEF5DE99] hover:text-[#FEF5DE] rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <ShoppingBag className="size-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 px-0.75 bg-[#EAEA4C] text-[#12100A] text-[8px] font-black flex items-center justify-center rounded-full leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              id="header-account-btn"
              href={user ? "/profile" : "/auth/login"}
              aria-label="Account"
              className="size-10 flex items-center justify-center text-[#FEF5DE99] hover:text-[#FEF5DE] rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-150"
            >
              <User className="size-4.5" />
            </Link>

            {/* Hamburger — mobile only */}
            <button
              id="header-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden ml-1 size-10 flex items-center justify-center text-[#FEF5DE99] hover:text-[#FEF5DE] rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Menu className="size-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="inset-y-4 left-4 w-[calc(100vw-2rem)] max-w-75 max-h-[calc(100vh-2rem)] bg-linear-to-b from-[#0E271A] to-[#0B1C13] border border-[#FFFFFF2B] rounded-2xl flex flex-col p-5 [&>button]:hidden"
        >
          {/* Sheet Header */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#FFFFFF1A]">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              aria-label="Diceymio home"
            >
              <Image src={Logo} alt="Diceymio" className="h-7 w-auto" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="cursor-pointer hover:scale-110 active:scale-95 transition-all text-[#FEF5DE]"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav
            className="flex-1 flex flex-col gap-1 overflow-y-auto"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/10 text-[#FEF5DE]"
                      : "text-[#FEF5DE99] hover:bg-white/8 hover:text-[#FEF5DE]"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown className="size-4 opacity-40" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="mt-4 pt-4 border-t border-[#FFFFFF1A] space-y-2">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FEF5DE99] hover:bg-white/10 hover:text-[#FEF5DE] transition-all"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FEF5DE99] hover:bg-red-900/30 hover:text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-[#FEF5DE] border border-[#FFFFFF2B] hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-[#12100A] bg-[#EAEA4C] hover:bg-[#D4D84F] transition-all border-2 border-b-4 border-[#8D8D10] active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
