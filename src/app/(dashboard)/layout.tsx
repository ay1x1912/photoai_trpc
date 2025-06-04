import { SidebarProvider } from '@/components/ui/sidebar'
import DashBoardNavbar from '@/modules/dashboard/ui/components/dashboard-navBar'
import DashBoardSideBar from '@/modules/dashboard/ui/components/dashboard-sidebar'
import React, { HTMLAttributes } from 'react'
interface DashboardLayoutProps extends HTMLAttributes<HTMLDivElement>{

}
function DashboardLayout({children}:DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <DashBoardSideBar/> 
            <main className='flex flex-col  h-screen w-screen bg-muted'>
            <DashBoardNavbar/>
            {children}
           </main>
           
        </SidebarProvider>
    )
}

export default DashboardLayout
