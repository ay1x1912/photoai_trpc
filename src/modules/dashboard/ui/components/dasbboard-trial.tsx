"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashBoardToken() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.token.getTokens.queryOptions());

  return (
    <div className="border border-border/10 rounded-lg w-full bg-white/5 flex flex-col gap-y-2 group">
      <div className="p-3 flex flex-col gap-y-4 w-full">
        <div className="flex items-center gap-x-2 justify-between   w-full">
          <div className="flex justify-center items-center gap-x-2">
            <CreditCardIcon /> tokens
          </div>
          <p className="text-sm font-medium">{`${data?.token}`}</p>
        </div>
          </div>
          <Button className="bg-transparent border-t border-border/10  w-full hover:border-white/10 rounded-t-none" asChild>
              <Link href={'/purchase'}>Purchase</Link>
          </Button>
    </div>
  );
}
