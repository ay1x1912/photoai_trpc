
import { SidebarProvider } from "@/components/ui/sidebar";
import DashBoardNavbar from "@/modules/dashboard/ui/components/dashboard-navBar";
// import DashBoardNavbar from '@/modules/dashboard/ui/components/dashboard-navBar'
import DashBoardSideBar from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashBoardSideBar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-screen">
        <DashBoardNavbar/>
        
        {children}
      </main>
     </SidebarProvider>
  );
}

export default DashboardLayout;
