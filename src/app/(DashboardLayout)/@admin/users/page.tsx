"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ShieldOff,
  ShieldCheck,
  Mail,
  ShoppingBag,
  Store,
  Calendar,
  Activity,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { adminService } from "@/services/admin.service";
import { formatDate, cn } from "@/lib/utils";
import { User } from "@/types/auth.types";
import { toast } from "sonner";

interface UserWithCount extends User {
  _count?: {
    orders?: number;
    medicines?: number;
  };
}

const ROLE_FILTERS = [
  { label: "All Identities", value: "ALL" },
  { label: "Customers", value: "CUSTOMER" },
  { label: "Sellers", value: "SELLER" },
] as const;

type RoleFilter = "ALL" | "CUSTOMER" | "SELLER";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // FIX 1: strong typed state
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [actionTarget, setActionTarget] = useState<UserWithCount | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const res = await adminService.getUsers(roleFilter);

        if (res.success && res.data) {
          setUsers(res.data as UserWithCount[]);
        }
      } catch {
        toast.error("User synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const stats = useMemo(
    () => ({
      customers: users.filter((u) => u.role === "CUSTOMER").length,
      sellers: users.filter((u) => u.role === "SELLER").length,
    }),
    [users]
  );

  const handleToggleBan = async () => {
    if (!actionTarget) return;

    setProcessing(true);

    try {
      const res = await adminService.updateUserStatus(
        actionTarget.id,
        !actionTarget.isBanned
      );

      if (res.success) {
        toast.success(
          `Access updated for ${actionTarget.name}`
        );

        setUsers((prev) =>
          prev.map((u) =>
            u.id === actionTarget.id
              ? { ...u, isBanned: !u.isBanned }
              : u
          )
        );

        setActionTarget(null);
      }
    } catch {
      toast.error("Protocol update failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 pb-10">

      {/* HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Identity Registry
          </h1>

          <p className="text-sm text-slate-400">
            {loading
              ? "Refreshing..."
              : `${users.length} identities found`}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
            <ShoppingBag className="inline h-4 w-4" />{" "}
            {stats.customers} Buyers
          </div>

          <div className="rounded-2xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
            <Store className="inline h-4 w-4" />{" "}
            {stats.sellers} Vendors
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="h-12 pl-10"
          />
        </div>

        {/* FIX 2: safe Select handler */}
        <Select
          value={roleFilter}
          onValueChange={(val) =>
            setRoleFilter(val as RoleFilter)
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {ROLE_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* USERS */}
      <div className="rounded-2xl border bg-white">

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users className="mx-auto mb-3 h-10 w-10 opacity-20" />
            No users found
          </div>
        ) : (
          <div className="divide-y">

            {/* FIX 3: JSX structure corrected */}
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-5"
                >
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActionTarget(user)}
                  >
                    {user.isBanned ? (
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <ShieldOff className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        )}
      </div>

      {/* DIALOG */}
      <Dialog
        open={!!actionTarget}
        onOpenChange={() => setActionTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionTarget?.isBanned
                ? "Unban User"
                : "Ban User"}
            </DialogTitle>

            <DialogDescription>
              Confirm action for {actionTarget?.name}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionTarget(null)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleToggleBan}
              disabled={processing}
            >
              {processing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}