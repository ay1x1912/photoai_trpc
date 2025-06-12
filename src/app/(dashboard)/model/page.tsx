import { auth } from "@/lib/auth";
import ModelView, {
  ModelsiewErrorState,
  ModelsViewLoadingState,
} from "@/modules/model/ui/views/model-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
async function ModelPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.model.getModel.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ModelsViewLoadingState />}>
        <ErrorBoundary fallback={<ModelsiewErrorState />}>
          <ModelView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

export default ModelPage;
