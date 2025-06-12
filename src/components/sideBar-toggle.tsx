"use client";
import React from "react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";

export default function SideBarToggleButton() {
  const isMobile = useIsMobile();
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
      {state == "collapsed" || isMobile ? (
        <PanelLeftIcon className="size-4" />
      ) : (
        <PanelLeftCloseIcon className="size-4" />
      )}
    </Button>
  );
}
