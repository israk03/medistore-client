"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {  motion } from "framer-motion";
import {
  Pill,
  LayoutDashboard,
  ShoppingBag,
  User,
  Package,
  Users,
  Tag,
  LogOut,
  ChevronLeft,
  Menu,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */
type SidebarLink = {
  label: string;
  href: string;
  icon: React.ElementType;
};

/* ---------------- LINKS ---------------- */
const CUSTOMER_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/orders", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

const SELLER_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Medicines", href: "/medicines", icon: Pill },
  { label: "Orders", href: "/orders", icon: Package },
];

const ADMIN_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Categories", href: "/categories", icon: Tag },
];

/* ---------------- THEME ---------------- */
const ROLE_THEME: Record<
  string,
  { gradient: string; text: string }
> = {
  ADMIN: { gradient: "from-rose-500 to-red-600", text: "text-rose-600" },
  SELLER: { gradient: "from-amber-400 to-orange-500", text: "text-amber-600" },
  CUSTOMER: { gradient: "from-indigo-500 to-violet-600", text: "text-indigo-600" },
};

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  if (!mounted || !user) return null;

  const currentTheme = ROLE_THEME[user.role] ?? ROLE_THEME.CUSTOMER;

  const links: SidebarLink[] =
    user.role === "ADMIN"
      ? ADMIN_LINKS
      : user.role === "SELLER"
      ? SELLER_LINKS
      : CUSTOMER_LINKS;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Session closed safely");
      router.replace("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white overflow-hidden">

      {/* BRAND */}
      <div className="h-20 flex items-center px-6 border-b border-slate-50">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-2xl bg-gradient-to-br",
              currentTheme.gradient
            )}
          >
            <Pill className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-black">
                Medi<span className="text-indigo-600">Store</span>
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* USER */}
      {!collapsed && (
        <div className="px-4 py-6">
          <div className="p-4 rounded-2xl bg-slate-50 border">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                  currentTheme.gradient
                )}
              >
                {user.name?.charAt(0)}
              </div>

              <div>
                <p className="font-bold">{user.name}</p>
                <div className={cn("text-xs flex items-center gap-1", currentTheme.text)}>
                  <ShieldCheck className="w-3 h-3" />
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINKS */}
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link: SidebarLink) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl",
                isActive ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"
              )}
            >
              <link.icon className="w-5 h-5" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 bottom-4 lg:hidden p-4 rounded-full bg-indigo-600 text-white"
      >
        <Menu />
      </button>

      {/* MOBILE */}
      <div>
        {mobileOpen && (
          <>
            <motion.div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 z-50 w-80 h-screen bg-white"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </div>

      {/* DESKTOP */}
      <aside
        className="hidden lg:flex h-screen border-r bg-white sticky top-0"
        style={{ width: collapsed ? 100 : 280 }}
      >
        <SidebarContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-24 -right-3 bg-white border rounded-full p-1"
        >
          <ChevronLeft
            className={cn("w-4 h-4", collapsed && "rotate-180")}
          />
        </button>
      </aside>
    </>
  );
}