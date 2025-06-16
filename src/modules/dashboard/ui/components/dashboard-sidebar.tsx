"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { BotIcon,  CameraIcon,  PaintBucketIcon,  StarIcon} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import DashboardUserButton from './dashboard-userButton'
import DashBoardToken from './dasbboard-trial'

const firstSection=[
    {
      icon:BotIcon,
      label:"Train",
      href:"/train"
    },
    {
        icon:CameraIcon,
        label:"Camera",
        href:"/camera"
  },
  {
    icon: PaintBucketIcon,
    label: "Models",
    href:"/model"
    }
]
const secondSection=[
    {
        icon:StarIcon,
        label:"Purchase",
        href:"/purchase"
    }
]

function DashBoardSideBar() {
    const pathName=usePathname()
    return (
      <Sidebar className="bg-primary">
        <SidebarHeader className="text-sidebar-accent-foreground ">
          <Link href={"/"} className="flex items-center gap-2 px-2 pt-2">
            <Image src={"/logo.svg"} alt="Photo AK" height={36} width={36} />
            <p className="text-2xl font-semibold">Photo AI</p>
          </Link>
        </SidebarHeader>
        <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarContent className="bg-sidebar">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {firstSection.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10  text-xl hover:bg-linear-to-r/oklch from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 border border-transparent hover:border-[#5D6B68]",
                        pathName === item.href &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10"
                      )}
                      isActive={pathName == item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondSection.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10  text-xl hover:bg-linear-to-r/oklch from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50 border border-transparent hover:border-[#5D6B68]",
                        pathName === item.href &&
                          "bg-linear-to-r/oklch border-[#5D6B68]/10"
                      )}
                      isActive={pathName == item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-white">
          <DashBoardToken/>
          <DashboardUserButton />
        
        </SidebarFooter>
      </Sidebar>
    );
}

export default DashBoardSideBar
