"use client";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { useState } from "react";
import { IoWarning } from "react-icons/io5";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<IssueForm>({
      resolver: zodResolver(createIssueSchema),
   });

   const [error, setError] = useState("");
   return (
      <div>
         {error && (
            <Callout.Root color="red">
               <Callout.Icon>
                  <IoWarning />
               </Callout.Icon>
               <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
         )}
         <form
            onSubmit={handleSubmit(async (values) => {
               try {
                  const res = await axios.post("/api/issues", values);
                  console.log({ res });
               } catch (err) {
                  console.log({ err });
                  setError("Unexpected error occured.");
               }
            })}
            className="max-w-xl space-y-5"
         >
            <div>
               {" "}
               <TextField.Root
                  placeholder="title"
                  {...register("title", { required: false })}
               />
               {errors.title?.message && (
                  <Text color="red" as="p">
                     {errors.title?.message}
                  </Text>
               )}
            </div>

            <div>
               <Controller
                  control={control}
                  name="description"
                  defaultValue=""
                  render={({ field }) => (
                     <SimpleMdeReact placeholder="description" {...field} />
                  )}
               />
               {errors.description?.message && (
                  <Text as="p" color="red">
                     {errors.description?.message}
                  </Text>
               )}
            </div>
            <Button>Submit new Issue</Button>
         </form>
      </div>
   );
};

export default NewIssuePage;
