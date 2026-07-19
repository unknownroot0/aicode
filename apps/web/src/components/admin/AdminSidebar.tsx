"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  User,
  LogOut,
  ChevronRight,
  Ticket,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./Sheet";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Coupons",
    href: "/dashboard/coupons",
    icon: Ticket,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  onHoverSidebarCollapsed: boolean;
  setOnHoverSidebarCollapsed: (hovered: boolean) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onHoverSidebarCollapsed,
  setOnHoverSidebarCollapsed,
  isSheetOpen,
  setIsSheetOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname, setIsSheetOpen]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <div
      className={cn(
        "h-full border border-default rounded-md overflow-hidden flex flex-col bg-white dark:bg-[#191B1F] transition-width duration-300",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Logo */}
      <div className="p-3 border-b border-default h-[70px] flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl">
            🎲
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
              Diceymio
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className={cn("h-full flex-1 overflow-y-auto p-3")}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 text-sm font-medium capitalize px-2.5 py-3 rounded-[10px] text-[#334155] dark:text-[#cbd5e1] hover:bg-primary/20 hover:text-primary dark:hover:text-[#55FF82] transition-colors",
                  isActive && "bg-primary/20 text-primary dark:text-[#55FF82]"
                )}
              >
                <span className={cn(collapsed && "w-full flex justify-center")}>
                  <Icon className="size-5" />
                </span>
                {!collapsed && (
                  <div className="grow whitespace-nowrap">{item.title}</div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-transparent cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="xl:block hidden fixed top-0 bottom-0 sm:py-6 py-3 sm:pl-6 pl-3"
        onMouseEnter={() => {
          if (isSidebarCollapsed && !onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(false);
            setOnHoverSidebarCollapsed(true);
          }
        }}
        onMouseLeave={() => {
          if (!isSidebarCollapsed && onHoverSidebarCollapsed) {
            setIsSidebarCollapsed(true);
            setOnHoverSidebarCollapsed(false);
          }
        }}
      >
        <SidebarContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="left"
          className="border-default flex flex-col gap-0 bg-white dark:bg-[#191B1F] z-50!"
        >
          <SheetHeader className="hidden">
            <SheetTitle>Admin Menu</SheetTitle>
            <SheetDescription>
              Navigate through the admin platform
            </SheetDescription>
          </SheetHeader>
          <div className="h-full py-3 pl-3 pr-0">
            <SidebarContent collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
