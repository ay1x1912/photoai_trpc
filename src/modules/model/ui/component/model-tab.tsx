import React, { Dispatch, SetStateAction } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ModelGetMany } from "../../model-types";
import { Status } from "@/modules/image/type";
import Image from "next/image";
import { Check, Clock, Loader2, Plus,  Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface ModelTabProps {
  models: ModelGetMany;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
}
export default function ModelTab({
  models,
  selectedModel,
  setSelectedModel,
  setActiveTab,
}: ModelTabProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <Card
          key={model.id}
          className={`overflow-hidden hover:shadow-lg transition-all ${
            selectedModel === model.id ? "ring-2 ring-purple-500" : ""
          }`}
          onClick={() =>
            model.status === Status.Success && setSelectedModel(model.id)
          }
        >
          <div className="relative aspect-square bg-slate-100">
            {model.status === Status.Success ? (
           
                <Image
                  src={model.thumbnailUrl || "/placeholder.svg"}
                  alt={model.name}
                  fill
                  className="object-cover"
                />
            
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-2" />

                {/* TODO Implemt traingin progress */}
                {/* <p className="text-sm text-slate-500">
                    Training: {model.trainingProgress}%
                  </p> */}
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge
                className={`${
                  model.status === Status.Success
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {model.status === Status.Success ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {model.status === Status.Success ? "Ready" : "Training"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{model.name}</h3>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Professional headshot specialist
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            {model.status === Status.Success ? (
              <>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  size="sm"
                  onClick={() => {
                    setSelectedModel(model.id);
                    setActiveTab("generate");
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="flex-1" disabled>
                <Clock className="w-4 h-4 mr-2" />
                Training...
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {/* Create New Model Card */}
      <Card className="overflow-hidden border-dashed hover:border-purple-300 transition-colors">
        <div className="aspect-square flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="font-medium mb-2">Create New Model</h3>
          <p className="text-sm text-slate-500 mb-4">
            Train a new AI model with your photos
          </p>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
            onClick={() => router.push("/train")}
          >
            Start Training
          </Button>
        </div>
      </Card>
    </div>
  );
}
