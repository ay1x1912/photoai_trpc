import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/image/param";
import ImageView, { ImagesViewErrorState, ImagesViewLoadingState } from "@/modules/image/ui/views/image-view";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface CameraPageProps{
  searchParams:Promise<SearchParams>
}
async function CameraPage({ searchParams }: CameraPageProps) {
  const params=await searchParams
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const filters = loadSearchParams(params);
  const queryClient = getQueryClient();
  console.log(params)
  void queryClient.prefetchQuery(trpc.image.getImages.queryOptions({page:filters.pages}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ImagesViewLoadingState />}>
        <ErrorBoundary fallback={<ImagesViewErrorState />}>
          <ImageView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
export default CameraPage;
