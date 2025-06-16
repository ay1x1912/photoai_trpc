"use client";
import React, { Dispatch, SetStateAction, useState } from "react";

import {
  Copy,
  History,
  Info,
  Lightbulb,
  Loader2,
  User,
  Wand2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ModelGetMany } from "../../model-types";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

const promptSuggestions = [
  "Professional headshot in business attire",
  "Casual portrait in a coffee shop",
  "Outdoor adventure in mountain landscape",
  "Urban street style in a city environment",
  "Formal portrait for corporate website",
  "Creative portrait with artistic lighting",
];

const recentPrompts = [
  { text: "Professional headshot with blue background", date: "2 hours ago" },
  { text: "Casual portrait in nature", date: "Yesterday" },
  { text: "Business meeting presentation", date: "3 days ago" },
];
const stylePresets = [
  {
    id: 1,
    name: "Professional",
    description: "Clean, corporate look with neutral background",
  },
  {
    id: 2,
    name: "Casual",
    description: "Relaxed, natural lighting in everyday settings",
  },
  {
    id: 3,
    name: "Artistic",
    description: "Creative composition with dramatic lighting",
  },
  {
    id: 4,
    name: "Cinematic",
    description: "Movie-like quality with film grain",
  },
  { id: 5, name: "Vintage", description: "Retro aesthetic with warm tones" },
  {
    id: 6,
    name: "Studio",
    description: "Professional studio lighting with clean background",
  },
];
interface GenerateTabProps {
  models: ModelGetMany;
  selectedModel: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setGenertateImageId: Dispatch<SetStateAction<string>>;
}
export default function GenerateTab({
  models,
  selectedModel,
  setActiveTab,
  setGenertateImageId,
}: GenerateTabProps) {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const generate = useMutation(
    trpc.image.create.mutationOptions({
      onSuccess: (data) => {
        setIsGenerating(true);
        toast("Generating Image");
        setGenertateImageId(data.id);
        queryClient.invalidateQueries(trpc.image.getImages.queryOptions({}));
        queryClient.invalidateQueries(trpc.token.getTokens.queryOptions());
        setActiveTab("gallery");
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "FORBIDDEN") {
          router.push("/purchase");
        }
      },
    })
  );
  const finalPrompt = `stype:${selectedStyle} prompt:${prompt}`;
  const handleGenerate = (
    modelId: string,
    prompt: string,
    styles: string | undefined
  ) => {
    if (!modelId) {
      toast("Please select a model");
      return;
    }
    if (!prompt) {
      toast("Please enter a prompt");
      return;
    }
    generate.mutate({ prompt, modelId, styles });
  };
  const handleUsePrompt = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Generation Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Selected Model */}
        <Card className="overflow-hidde">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Selected Model
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg relative overflow-hidden">
                {models.find((m) => m.id === selectedModel)?.thumbnailUrl ? (
                  <Image
                    src={
                      models.find((m) => m.id === selectedModel)
                        ?.thumbnailUrl || "/placeholder.svg"
                    }
                    alt={models.find((m) => m.id === selectedModel)?.name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">
                    {models.find((m) => m.id === selectedModel)?.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  {/* {models.find((m) => m.id === selectedModel)?.description} */}
                  Personal Professional headshot specialist
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompt Input */}
        <Card className="overflow-hidden ">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white  ">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the image you want to generate..."
                value={!!prompt ? prompt : " "}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-between">
                <div className="text-xs text-slate-500">
                  {!!prompt ? prompt.length : 0} characters
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Style Preset</Label>
              </div>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  {stylePresets.map((style) => (
                    <SelectItem key={style.id} value={style.name}>
                      <div className="flex  justify-center items-center gap-x-4">
                        <span>{style.name}</span>
                        <span className="text-xs text-slate-500">
                          {style.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() =>
                handleGenerate(selectedModel, finalPrompt, selectedStyle)
              }
              disabled={!prompt || isGenerating}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Column - Suggestions and History */}
      <div className="space-y-6">
        {/* Prompt Suggestions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Prompt Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {promptSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                  onClick={() => handleUsePrompt(suggestion)}
                >
                  <div className="truncate">{suggestion}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Prompts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              Recent Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentPrompts.map((item, index) => (
                <div key={index} className="group flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={() => handleUsePrompt(item.text)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <div className="flex-1">
                    <p className="text-sm truncate">{item.text}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2">
                <Info className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium">Prompt Tips</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>• Be specific about settings, lighting, and mood</p>
              <p>• Include details about camera type for realistic photos</p>
              <p>
                • Specify &quot;high quality, detailed&quot; for better results
              </p>
              <p>• Use negative prompts to avoid unwanted elements</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
