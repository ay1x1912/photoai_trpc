import { auth } from '@/lib/auth'
import HomeView from '@/modules/home/ui/veiws/home-view'
import { caller } from '@/trpc/server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import React from 'react'

async function Page() {
  
  const session=await auth.api.getSession({
    headers:await headers()
  })
  if(!session){
   redirect("/sign-in")
  }
  return (
   
   <HomeView/>
  )
}

export default Page
