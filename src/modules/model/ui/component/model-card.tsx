"use client";
/* eslint-disable @next/next/no-img-element */
import { Textarea } from "@/components/ui/textarea";
import { Status } from "@/modules/image/type";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { toast } from "sonner";

interface ModelCardProps {
  status: Status;
  id: string;
  name: string;
  thumbnailUrl: string;
}
export default function ModelCard({
  id,
  name,
  thumbnailUrl,
  status,
}: ModelCardProps) {
  const isLoadingModel = status === Status.Pending;
  const isFailedModel =(status==Status.Failed)
  const [prompt, setPrompt] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const trpc = useTRPC();
  const generateImage = useMutation(
    trpc.image.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.image.getImages.queryOptions({}));
        router.push("/camera");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const handleOnClick = () => {
    if (!prompt) {
      toast("Please enter a prompt");
      return;
    }
    generateImage.mutate({ prompt, modelId: id });
    router.push("/camera");
  };
  if (isFailedModel) {
    return (
      <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
        <div className="relative p-2.5 h-96 overflow-hidden rounded-xl bg-clip-border  flex justify-center items-center ">
          <div className="absolute left-1/2 top-1/2 -translate-x-20 w-full">
            <AlertTriangleIcon className=" size-24  text-destructive translate-x-5  " />
            <p className="text-slate-600 text-md font-light  -translate-x-18 ">
              Failed to load the model please try again{" "}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-slate-800 text-xl font-semibold">{name}</p>
          </div>
          <Textarea
            disabled={isLoadingModel}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="text-slate-600 leading-normal font-light"
          />

          <button
            onClick={() => toast.error("Failed to load model please try again")}
            className="rounded-md w-full mt-6 bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Generate image
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
      {isLoadingModel ? (
        <div className="h-96 w-full rounded-md object-cover object-top  transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl relative">
          <LoaderIcon className=" size-12 animate-spin text-primary absolute left-1/2 top-1/2 -translate-x-8" />
        </div>
      ) : (
        <div className="relative p-2.5 h-96 overflow-hidden rounded-xl bg-clip-border">
          <img
            src={`${thumbnailUrl}`}
            alt="card-image"
            className="h-full w-full object-cover rounded-md"
          />
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-slate-800 text-xl font-semibold">{name}</p>
        </div>
        <Textarea
          disabled={isLoadingModel}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="text-slate-600 leading-normal font-light"
        />

        <button
          onClick={handleOnClick}
          disabled={isLoadingModel}
          className="rounded-md w-full mt-6 bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Generate image
        </button>
      </div>
    </div>
  );
}
