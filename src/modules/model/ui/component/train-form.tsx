"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useZipURL } from "@/store/zipUrl";
import { trainModelSchema } from "../../schema";
import { Ethinicity, EyeColor, Gender } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

export type TrainFormState = {
  name: string;
  age: number; // stored as string even if it's a number later
  gender: string; // assuming you meant `type` from the original schema
  ethnicity: string;
  eyeColor: string;
  zipUrl: string;
};

export default function MyForm() {
  const trpc = useTRPC();
  const router = useRouter();
  const createModel = useMutation(
    trpc.model.createModel.mutationOptions({
      onSuccess: () => {
        toast.success("Form summbited");
        router.push("/camera");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const zipUrl = useZipURL((state) => state.zipUrl);
  // const isZipUploaded=!zipUrl
  const form = useForm<z.infer<typeof trainModelSchema>>({
    resolver: zodResolver(trainModelSchema),
    defaultValues: {
      gender: Gender.Man,
      eyeColor: EyeColor.Brown,
      ethinicity: Ethinicity.South_East_Asian,
    },
  });

  async function onSubmit(values: z.infer<typeof trainModelSchema>) {
    if (!zipUrl) {
      toast("please upload files");
      return;
    }
    
    const payload = { ...values, zipUrl };
    console.log(payload);
    createModel.mutate(payload);
  }

  return (
    <div className=" max-w-6xl w-full max-h-screen overflow-y-auto flex flex-col ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" grid grid-cols-3 gap-x-4 gap-y-10  ">
            <div>
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

            <div>
              <FormField
                control={form.control}
                name="age"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Age {value}</FormLabel>
                    <FormControl>
                      <Slider
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
                        className="flex flex-col space-y-1"
                      >
                        {Object.values(Gender).map((value) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={value} id={value} />
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
                    <FormDescription>Select your gender</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select your ethinicity" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Ethinicity).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Select your ethnicity.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
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
                    <FormDescription>Select your eye color</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center  items-center w-full border">
              <Button type="submit">submit form</Button>
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="zipUrl"
                // eslint-disable-next-line
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* <Uploader /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
