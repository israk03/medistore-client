"use client";

import { useAuth } from "@/context/AuthContext";

export function RoleSlotPicker({ 
  admin, 
  seller, 
  customer 
}: { 
  admin: React.ReactNode; 
  seller: React.ReactNode; 
  customer: React.ReactNode; 
}) {
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <>{admin}</>;
  if (user?.role === "SELLER") return <>{seller}</>;
  return <>{customer}</>;
}