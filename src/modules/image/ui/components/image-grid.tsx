import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, Share2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ImageGetMany } from "../../image-types";
import { saveAs } from "file-saver";
import { Status } from "../../type";
import { Badge } from "@/components/ui/badge";

interface ImageGridProps {
  currentPhotos: ImageGetMany;
}
export default function ImageGrid({ currentPhotos }: ImageGridProps) {
  const downloadImage = (imageUrl: string) => {
    saveAs(imageUrl, "image.jpg"); // Put your image URL here.
  };

  return (
    <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {currentPhotos.map((photo) => (
        <Card
          key={photo.id}
          className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative">
            {photo.status === Status.Pending ? (
              <Image
                src={"/loading.svg"}
                alt={photo.prompt.split("prompt:")[1] || "Hello world"}
                width={400}
                height={400}
                className=" w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Image
                src={photo.imageUrl || "/placeholder.svg"}
                alt={photo.prompt.split("prompt:")[1] || "Hello world"}
                width={400}
                height={400}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={
                      photo.status === (Status.Pending || Status.Failed)
                    }
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    disabled={
                      photo.status === (Status.Pending || Status.Failed)
                    }
                    onClick={() => downloadImage(photo.imageUrl)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardContent className="p-4 ">
            <div className="space-y-3">
             <div className="flex items-center justify-between mb-2">
                          {/* <Badge>{photo.model.name}</Badge> */}
                          {photo.styles && (
                            <Badge variant="outline">{photo.styles!}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {photo.prompt.split("prompt:")[1]}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(photo.createdAt).toDateString()}
                        </p>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={
                        photo.status === (Status.Pending || Status.Failed)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {photo.status === Status.Pending
                        ? "Generating"
                        : "View Details"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Photo Details</DialogTitle>
                      <DialogDescription>
                        Generated image with AI
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Image
                        src={photo.imageUrl || "/placeholder.svg"}
                        alt={photo.prompt.split("prompt:")[1]}
                        width={600}
                        height={400}
                        className="w-full rounded-lg"
                      />
                      <div className="space-y-2">
                        <p>
                          <strong>Prompt:</strong>{" "}
                          {photo.prompt.split("prompt:")[1]}
                        </p>
                        {/* <p>
                          <strong>Style:</strong> {photo.style}
                        </p> */}
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => downloadImage(photo.imageUrl)}
                  disabled={photo.status === (Status.Pending || Status.Failed)}
                  size="sm"
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
