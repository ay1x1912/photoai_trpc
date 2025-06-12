"use client";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFilters } from "../../hooks/filter-hook";

import ImageGrid from "../components/image-grid";
import DataPagination from "../components/image-data-pagination";
import { useEffect, useState } from "react";
import { Status } from "../../type";

function ImageView() {
  const [filters, setFilters] = useFilters();
  const [shouldPoll, setShouldPoll] = useState(true);
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.image.getImages.queryOptions(
      { page: filters.pages },
      { refetchInterval: shouldPoll ? 2000 : false }
    )
  );
  useEffect(() => {
    if (data.images.every((img) => img.outputImage.status===Status.Success)) {
      setShouldPoll(false); // stop polling when all URLs are ready
    }
  }, [data]);
  if (data.images.length == 0) {
    return (
      <EmptyState
        image="/empty.svg"
        title="Create your first Image"
        description="Create an Model  to generate images"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <ImageSearch /> */}
      <ImageGrid currentPhotos={data.images} />
      <DataPagination totalPages={data.totalPages} page={filters.pages} onPageChange={(page)=>setFilters({pages:page})} />
    </div>
  );
  // return (
  //   <section className="  border ">
  //     <div className="mx-auto max-w-5xl px-6">
  //       <div className="mt-12 ">
  //         <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
  //           {data.images.map((image, ind) => (
  //               <AuthorCard
  //               index={ind}
  //               status={image.status}
  //               key={ind}
  //               backgroundImage={image.imageUrl }
  //               content={{
  //                 title: "Image",
  //                 description: image.prompt,
  //               }}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //     <DataPagination
  //       totalPages={data.totalPages}
  //       page={filters.pages}
  //       onPageChange={(page)=>setFilters({pages:page})}
  //     />
  //   </section>
  // );
}

export default ImageView;

export const ImagesViewLoadingState = () => {
  return (
    <LoadingState
      title="Loading Images"
      description="Thsi may take a few seconds"
    />
  );
};

export const ImagesViewErrorState = () => {
  return (
    <ErrorState
      title="Error loading Images"
      description="Please try again later"
    />
  );
};
