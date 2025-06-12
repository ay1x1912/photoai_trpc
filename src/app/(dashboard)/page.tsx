import { auth } from "@/lib/auth";
import MyForm from "@/modules/model/ui/component/train-form";
// import HomeView from '@/modules/home/ui/veiws/home-view'

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import React from "react";

async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div className="flex justify-center items-center h-screen border w-full">
      <MyForm />
    </div>
  );
}

export default Page;
