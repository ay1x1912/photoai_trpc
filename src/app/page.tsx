import { auth } from '@/lib/auth';
import LandingPage from '@/modules/model/ui/views/home-veiw'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

 export default async function Page() {
   const session = await auth.api.getSession({
     headers: await headers(),
   });
   if (session?.user) {
     redirect("/model");
   }
   return <LandingPage />;
 }
