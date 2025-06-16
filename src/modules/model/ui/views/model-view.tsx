"use client";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ModelMain from "../component/model-main";
import { Status } from "@/modules/image/type";

function ModelView() {
  const trpc = useTRPC();
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data } = useSuspenseQuery(trpc.model.getModel.queryOptions({},{refetchInterval: shouldPoll ? 2000 : false }));
   useEffect(() => {
      if (data.every((model) => model.status===Status.Success)) {
        setShouldPoll(false); // stop polling when all URLs are ready
      }
    }, [data]);
  if (data.length == 0) {
    return (
      <EmptyState
        image="/empty.svg"
        title="Create your first model"
        description="Create an model to generate images"
      />
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 ">
      <ModelMain models={data} />
    </div>
  );
}

export default ModelView;

export const ModelsViewLoadingState = () => {
  return (
    <LoadingState
      title="Loading Models"
      description="Thsi may take a few seconds"
    />
  );
};

export const ModelsiewErrorState = () => {
  return (
    <ErrorState
      title="Error loading Models"
      description="Please try again later"
    />
  );
};
