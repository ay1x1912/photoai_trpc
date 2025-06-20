import React, { useState } from "react";
import {  Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ModelTab from "./model-tab";
import { ModelGetMany } from "../../model-types";
import GenerateTab from "./generate-tab";
import { User, Wand2 } from "lucide-react";


interface ModelMainProps{
    models:ModelGetMany
}
export default function ModelMain({ models }: ModelMainProps) {
  const [activeTab, setActiveTab] = useState("models");
  const [selectedModel, setSelectedModel] = useState<string>(" ");
  const [genertateImageId, setGenertateImageId] = useState<string>("")
    return (
      <div className="flex flex-col space-y-8">
        {/* Page Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Generate Images
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Create stunning AI-generated photos using your trained models or
            explore our style presets
          </p>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Note: Each image generation uses approximately 3 tokens.
          </p>
        </div>
        <Tabs
          defaultValue="models"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full  "
        >
          <TabsList className="grid grid-cols-2  max-w-lg mx-auto mb-8">
            <TabsTrigger value="models" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Models</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span>Generate</span>
            </TabsTrigger>
          </TabsList>
          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <ModelTab
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
          <TabsContent value="generate" className="space-y-8">
            <GenerateTab
              setGenertateImageId={setGenertateImageId}
              selectedModel={selectedModel}
              models={models}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
} 
