import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleSlotPicker } from "@/components/auth/RoleSlotPicker"; // We will create this

type DashboardLayoutProps = {
  admin: React.ReactNode;
  seller: React.ReactNode;
  customer: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardLayout({
  admin,
  seller,
  customer,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
           
              <RoleSlotPicker 
                admin={admin} 
                seller={seller} 
                customer={customer} 
              />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}