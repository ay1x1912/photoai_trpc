import { auth } from "@/lib/auth";
import PurchaseView, {
  PurcahseiewErrorState,
  PurchaseViewLoadingState,
} from "@/modules/token/ui/views/purchase-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.token.getProducts.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PurchaseViewLoadingState />}>
        <ErrorBoundary fallback={<PurcahseiewErrorState />}>
          <PurchaseView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
