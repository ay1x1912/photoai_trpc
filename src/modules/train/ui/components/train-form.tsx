"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trainModelSchema } from "@/modules/model/schema";
import { Ethinicity, EyeColor, Gender } from "@/modules/model/types";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  ImageIcon,
  Info,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Uploader from "@/components/uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

import { useZipURL } from "@/store/zipUrl";
import { useRouter } from "next/navigation";

export default function TrainingForm() {
  const zipUrl = useZipURL((state) => state.zipUrl);

  const [thumbNailUrl, setThumbNailUrl] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createModel = useMutation(
    trpc.model.createModel.mutationOptions({
      onSuccess: () => {
        toast.success("Form summbited");
        setIsTraining(true);
        queryClient.invalidateQueries(trpc.model.getModel.queryOptions({}));
        queryClient.invalidateQueries(trpc.token.getTokens.queryOptions());
        router.push("/model");
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "FORBIDDEN") {
          router.push("/purchase");
        }
      },
    })
  );

  async function onSubmit(values: z.infer<typeof trainModelSchema>) {
    console.log("hello world");
    if (!zipUrl) {
      toast("please upload files");
      return;
    }
    if (!thumbNailUrl) {
      toast("please upload files");
      return;
    }
    const payload = { ...values, zipUrl, thumbNailUrl };
    console.log(payload);
    createModel.mutate(payload);
  }
  const form = useForm<z.infer<typeof trainModelSchema>>({
    resolver: zodResolver(trainModelSchema),
    defaultValues: {
      gender: Gender.Man,
      eyeColor: EyeColor.Brown,
      ethinicity: Ethinicity.South_East_Asian,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Your AI Model
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Provide your details and upload photos to train a personalized AI
            model that can generate photos of you in any style or scenario
          </p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  ">
              <div className="lg:col-span-2 space-y-12  ">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Ayaan" type="" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the name of your model
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <FormLabel>Age {value}</FormLabel>
                            <FormControl>
                              <Slider
                                className="text-purple-500"
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[20]}
                                onValueChange={(vals) => {
                                  onChange(vals[0]);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Adjust your age by sliding.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1 "
                                >
                                  {Object.values(Gender).map((value) => (
                                    <div
                                      key={value}
                                      className="flex items-center space-x-2"
                                    >
                                      <RadioGroupItem
                                        className=""
                                        value={value}
                                        id={value}
                                      />
                                      <label
                                        htmlFor={value}
                                        className="capitalize text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {value}
                                      </label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormDescription>
                                Select your gender
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Physical Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div>
                          <FormField
                            control={form.control}
                            name="ethinicity"
                            render={({ field }) => (
                              <FormItem className=" flex flex-col  gap-4">
                                <FormLabel>Ethnicity</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select your ethinicity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(Ethinicity).map(
                                        (value) => (
                                          <SelectItem key={value} value={value}>
                                            {value.replace(/_/g, " ")}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormDescription>
                                  Select your ethnicity.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="eyeColor"
                          render={({ field }) => (
                            <FormItem className=" flex flex-col  gap-4">
                              <FormLabel>Eye Color</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select your eye color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(EyeColor).map((color) => (
                                      <SelectItem key={color} value={color}>
                                        {color.replace("_", " ")}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Select your eye color
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Training Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="zipUrl"
                        // eslint-disable-next-line
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Uploader setThumbNailUrl={setThumbNailUrl} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Training Tips</h3>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Upload 10-20 high-quality photos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Include variety in poses and expressions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Use clear, well-lit photos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Avoid group photos or heavy filters</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-medium">What&lsquo;s Next?</h3>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <p>After training, you&lsquo;ll be able to:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-purple-500" />
                          Generate photos in any style
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-purple-500" />
                          Create professional headshots
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-purple-500" />
                          Try different scenarios
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  disabled={isTraining}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
                >
                  {isTraining ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Training Model...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
