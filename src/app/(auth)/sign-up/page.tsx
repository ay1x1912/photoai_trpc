
import { auth } from '@/lib/auth'
import SignUpView from '@/modules/auth/sign-up-view'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

async function SignUpPage() {
     const session=await auth.api.getSession({
        headers:await headers()
      })
      if(!!session){
       redirect("/sign-in")
      }
    return (
       <SignUpView/>
    )
}

export default SignUpPage
