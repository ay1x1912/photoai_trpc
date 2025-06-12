"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Sparkles, Wand2, LogIn, Check } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const session =authClient.useSession()
    if (session.data?.user) {
     setIsLoggedIn(true)
   redirect("/model");
 }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold">PhotoGen AI</h1>
            </div>
            {!isLoggedIn ? (
              <Button
                variant="secondary"
                onClick={() => router.push("sign-in")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <span className="text-sm">Welcome back!</span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
            Transform your photos instantly
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Your Vision.
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our AI. One Perfect Photo.
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Generate hyper-personalized images in seconds.
          </p>

          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-4 text-lg h-auto mb-12"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Start Creating
          </Button>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              Transformation Examples
            </Badge>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Before & After Showcase
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how our AI transforms regular photos into stunning cartoon
              styles.
            </p>
          </div>

          <Card className="bg-white border-0 shadow-lg overflow-hidden max-w-7xl mx-auto">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-video bg-slate-100">
                  {/* <Image
                    src="/inputImgTwo.jpeg?height=400&width=600"
                    alt="Original photo"
                    fill
                    className="object-cover"
                  /> */}
                  <Image
                    className="h-96 w-full rounded-tl-md  object-cover object-top  transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl"
                    src="/inputImgTwo.jpeg"
                    alt="team member"
                    width="826"
                    height="1239"
                  />
                  <Badge className="absolute top-4 left-4 bg-slate-800 text-white">
                    Original
                  </Badge>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-amber-100 to-orange-100">
                  {/* <Image
                    src="/linkedHeadshot.webp?height=400&width=600"
                    alt="AI generated result"
                    fill
                    className="object-cover "
                  /> */}
                  <Image
                    className="h-96 w-full rounded-tl-md  object-cover object-top  transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl"
                    src="/linkedHeadshot.webp"
                    alt="team member"
                    width="826"
                    height="1239"
                  />
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    AI Generated
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Professional</Badge>
                  <span className="text-sm font-medium text-slate-700">
                    Prompt
                  </span>
                </div>
                <p className="text-slate-600">
                  AI-generated headshot for LinkedIn use, formal attire, direct
                  gaze, yellow background with soft vignette, studio-quality,
                  high-resolution portrait.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              Choose your plan
            </Badge>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              No Frills. Just your imagination
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get unlimited access to our AI transformation technology with our
              simple pricing options.
            </p>
          </div>

          <Card className="bg-white border-0 shadow-lg max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                  One-time Purchase
                </Badge>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">
                  10 Image Generations
                </h4>
                <div className="text-4xl font-bold text-amber-600 mb-2">
                  $3.00
                </div>
                <p className="text-slate-600 text-sm">
                  One-time payment for 10 cartoon image transformations
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "10 high-quality cartoon transformations",
                  "Download in full resolution",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                onClick={() => router.push("/sign-in")}
              >
                {isLoggedIn ? "Buy this credits" : "Sign up to purchase"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-r from-purple-500 to-blue-500   text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-bold">PhotoGen AI</h4>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 PhotoGen AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
    </div>
  );
}
