"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart, Menu, X, Pill, User,
  LogOut, LayoutDashboard, ChevronDown,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

const getDashboardLink = (role: string) => {
  if (role === "ADMIN") return "/dashboard";
  if (role === "SELLER") return "/dashboard";
  return "/dashboard";
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

 
  const cartBadge = mounted && totalItems > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 w-5 h-5 bg-[#6B4FE0] text-white text-xs rounded-full flex items-center justify-center font-medium"
    >
      {totalItems > 9 ? "9+" : totalItems}
    </motion.span>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-slate-100"
          : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 bg-linear-to-br from-[#6B4FE0] to-[#2D9D78] rounded-xl flex items-center justify-center shadow-lg"
            >
              <Pill className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold">
              <span className="text-[#6B4FE0]">Medi</span>
              <span className="text-[#2D9D78]">Store</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6B4FE0] transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#6B4FE0] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Right — guarded with mounted */}
          <div className="hidden md:flex items-center gap-3">

            {/* Cart */}
            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-slate-600" />
                {cartBadge}
              </motion.div>
            </Link>

            {/* Auth section */}
            {!mounted ? (
              <div className="w-24 h-9 rounded-xl bg-slate-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
  <DropdownMenuTrigger>
    <div
      className={cn(
        buttonVariants({ variant: "outline" }),
        "flex items-center gap-2 border-slate-200 hover:border-[#6B4FE0] hover:text-[#6B4FE0] cursor-pointer"
      )}
    >
      <div className="w-6 h-6 bg-linear-to-br from-[#6B4FE0] to-[#2D9D78] rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>

      <span className="max-w-25 truncate text-sm">
        {user.name.split(" ")[0]}
      </span>

      <ChevronDown className="w-3 h-3" />
    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-52 bg-white">
    <div className="px-3 py-2 border-b border-slate-100 ">
      <p className="text-sm font-medium truncate">{user.name}</p>

      <p className="text-xs text-muted-foreground truncate">
        {user.email}
      </p>

      <Badge
        className="mt-1 text-xs"
        style={{
          backgroundColor:
            user.role === "ADMIN"
              ? "#ef4444"
              : user.role === "SELLER"
              ? "#f59e0b"
              : "#6B4FE0",
          color: "white",
        }}
      >
        {user.role}
      </Badge>
    </div>

    <DropdownMenuItem
      onClick={() => router.push(getDashboardLink(user.role))}
      className="cursor-pointer"
    >
      <LayoutDashboard className="w-4 h-4" />
      Dashboard
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() => router.push("/profile")}
      className="cursor-pointer"
    >
      <User className="w-4 h-4" />
      Profile
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer text-red-500 focus:text-red-500"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[#6B4FE0] hover:bg-[#5a3fcb] text-white"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              {cartBadge}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#6B4FE0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-3 border-t border-slate-100 space-y-2">
                {/* Mobile auth — also guarded */}
                {mounted && isAuthenticated && user ? (
                  <>
                    <Link
                      href={getDashboardLink(user.role)}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      className="w-full bg-[#6B4FE0] hover:bg-[#5a3fcb] text-white"
                      asChild
                    >
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}