"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import DashBoardCommand from "@/modules/dashboard/ui/components/dashboard-command";

function DashBoardNavbar() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  // const [commandOpen, setCommadnOpen] = useState(false);
  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key == "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setCommadnOpen((open) => !open);
  //     }
  //   };
  //   document.addEventListener("keydown", down);
  //   return () => document.removeEventListener("keydown", down);
  // }, []);

  return (
    <>
      {/* <DashBoardCommand open={commandOpen} setOpen={setCommadnOpen} /> */}
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
          {state == "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        {/* <Button
          onClick={() => setCommadnOpen((open) => !open)}
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground
            hover:text-muted-foreground"
          variant={"outline"}
          size={"sm"}
        >
          <SearchIcon />
          search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-mutedm px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button> */}
      </nav>
    </>
  );
}

export default DashBoardNavbar;
