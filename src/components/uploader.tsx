/* eslint-disable @next/next/no-img-element */
"use client";
import { v4 as uuidv4 } from "uuid";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL, R2_URL } from "@/lib/config";
import { LoaderIcon, TrashIcon } from "lucide-react";
import JSZip from "jszip";
import { useZipURL } from "@/store/zipUrl";
interface UploaderProps{
  setThumbNailUrl:Dispatch<SetStateAction <string |null>>
}
function Uploader({setThumbNailUrl}:UploaderProps) {
  const setZipUrl = useZipURL((state) => state.setZipUrl);

  const [files, setFiles] = useState<
    Array<{
      id: string;
      file: File;
      uploading: boolean;
      progress: number;
      key?: string;
      isDeleting: boolean;
      error: boolean;
      objectUrl?: string;
    }>
  >([]);
  const uploadZip = async (
    files: Array<{
      id: string;
      file: File;
      uploading: boolean;
      progress: number;
      key?: string;
      isDeleting: boolean;
      error: boolean;
      objectUrl?: string;
    }>
  ) => {
    try {
      const { data } = await axios({
        method: "post",
        url: `${BACKEND_URL}/api/s3/presign`,
        data: {
          fileName: "images.zip",
        },
      });
      const formData = new FormData();
      const zip = new JSZip();
      const { presignedUrl, key } = data;
      files.forEach((file) => {
        const content = file.file.arrayBuffer();
        zip.file(file.file.name, content);
      });
      const content = await zip.generateAsync({ type: "blob" });
      formData.append("file", content);
      formData.append("key", key);
      formData.append("presignedUrl", presignedUrl);
      await axios.put(presignedUrl, formData);
      const zipUrl = `${R2_URL}/${key}`;
      toast(`Zip file  generate successfully`);
      setZipUrl(zipUrl);
      return zipUrl;
    } catch {
      toast.error("Failed to upload zipUrl");
    }
  };

  const removeFile = (fileId: string) => {
    try {
      const fileToRemove = files.find((f) => f.id === fileId);
      if (fileToRemove) {
        if (fileToRemove.objectUrl) {
          URL.revokeObjectURL(fileToRemove.objectUrl);
        }
      }
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f))
      );
      axios({
        method: "delete",
        url: `${BACKEND_URL}/api/s3/delete`,
        data: JSON.stringify({
          key: fileToRemove?.key,
        }),
      }).catch(function (error) {
        toast.error(error.toJSON());
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, isDeleting: false, error: true } : f
          )
        );
      });

      toast.success("File delted successfully");
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      toast.error("Failed to delete file");
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isDeleting: false, error: true } : f
        )
      );
    }
  };

  const uploadFile = 
  async (file: File) => {
    setFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    try {
      const { data } = await axios({
        method: "post",
        url: `${BACKEND_URL}/api/s3/presign`,
        data: {
          fileName: file.name,
          contentType: file.type,
        },
      });

      const { presignedUrl, key } = data;

      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, uploading: true, progress: 0, error: false, key }
            : f
        )
      );

      // Upload to the presigned URL
      await axios.put(presignedUrl, file, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
          );

          setFiles((prev) =>
            prev.map((f) => (f.file === file ? { ...f, progress } : f))
          );
        },
      });

      // Mark upload as done
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file ? { ...f, uploading: false, progress: 100 } : f
        )
      );
       setThumbNailUrl(`${R2_URL}/${key}`)
      toast.success(`ThumbNail  uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Upload failed for ${file.name}`);
      setFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, uploading: false, progress: 0, error: true }
            : f
        )
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        objectUrl: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      uploadFile(acceptedFiles[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onDropRejected = useCallback((fileRejection: FileRejection[]) => {
    if (fileRejection.length > 0) {
      const toManyFiles = fileRejection.find(
        (fileRejection) => fileRejection.errors[0].code === "too-many-files"
      );
      const fileTooLarge = fileRejection.find(
        (fileRejection) => fileRejection.errors[0].code === "file-too-large"
      );
      if (toManyFiles) toast.error("You can upload 10 files at a time ");
      if (fileTooLarge) toast.error("You can upload 10 files at a time ");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 10,
    maxSize: 1024 * 1024 * 10,
    accept: { "image/*": [] },
  });

  return (
    <div className="flex flex-col gap-y-4  w-full h-full  justify-center items-center">
      <Card
        className={cn(
          "relative border-2 border-dashed transition-colorr duration-200 ease-in-out w-3/4  h-64 mx-12 ",
          isDragActive
            ? "bg-gradient-to-r from-purple-500 to-blue-500 border-primary/10 border-solid"
            : " border-border hover:border-purple-500"
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <CardContent className="flex flex-col justify-center items-center  h-full w-full ">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className="flex flex-col justify-center items-center  h-full w-full gap-y-3">
              <p className="text-center ">
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500"
                type="button"
              >
                Select Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div>
        <Button
          className="bg-gradient-to-r from-purple-500 to-blue-500"
          type="button"
          onClick={async () => {
            await uploadZip(files);
          }}
        >
          Upload Zip
        </Button>
      </div>
      <div className="grid grid-col-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 ">
        {files.map((file) => (
          <div key={file.id} className="flex flex-col gap-1">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={file.objectUrl}
                alt={file.file.name}
                className="w-ful h-full object-cover"
              />
              <Button
                type="button"
                variant={"destructive"}
                size={"icon"}
                className="absolute top-2 right-2"
                onClick={() => removeFile(file.id)}
                disabled={file.uploading || file.isDeleting}
              >
                {file.isDeleting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <TrashIcon className="size-4" />
                )}
              </Button>

              {file.uploading && !file.isDeleting && (
                <div className="absolute inset-0 flex bg-black/50 justify-center items-center">
                  <div className=" text-white font-medium text-lg">
                    {file.progress}%
                  </div>
                </div>
              )}
              {file.error && (
                <div className="absolute inset-0 flex bg-red-500/50 justify-center items-center">
                  <p className=" text-white font-medium text-lg">Error</p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {file.file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Uploader;
