import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Status } from "@/modules/image/type";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Download, ImageIcon, Share2, Wand2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface GalleryTabProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  genertateImageId: string;
}
export default function GalleryTab({
  setActiveTab,
  genertateImageId,
}: GalleryTabProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const [shouldPoll, setShouldPoll] = useState(true);

 
  const { data } = useSuspenseQuery(
    trpc.image.getOneWithId.queryOptions(
      { id: genertateImageId! },

      { refetchInterval: shouldPoll ? 2000 : false }
    )
  );
  useEffect(() => {
    if (data.every((img) => img.outputImage.status === Status.Success)) {
      setShouldPoll(false); // stop polling when all URLs are ready
    }
  }, [data]);
  if (genertateImageId.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Generate your first image by selecting a model and entering a prompt
        </p>
        <Button
          onClick={() => setActiveTab("models")}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Start Generating
        </Button>
      </div>
    );
  }

  return data?.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((image) => (
        <Card key={image.outputImage.id} className="overflow-hidden group">
          <div className="relative aspect-square bg-slate-100">
            {image.outputImage.status === Status.Pending ? (
              <Image
                src={"/placeholder.svg"}
                alt={image.outputImage.prompt.split("prompt:")[1]}
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={image.outputImage.imageUrl || "/placeholder.svg"}
                alt={image.outputImage.prompt.split("prompt:")[1]}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge>{image.model.name}</Badge>
              {image.outputImage.styles && (
                <Badge variant="outline">{image.outputImage.styles!}</Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {image.outputImage.prompt.split("prompt:")[1]}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {new Date(image.outputImage.createdAt).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => router.push("/camera")}
              disabled={
                image.outputImage.status === (Status.Pending || Status.Failed)
              }
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {image.outputImage.status === Status.Pending
                ? "Generating"
                : "view Details"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Images Yet</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Generate your first image by selecting a model and entering a prompt
      </p>
      <Button
        onClick={() => setActiveTab("models")}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        Start Generating
      </Button>
    </div>
  );
}
