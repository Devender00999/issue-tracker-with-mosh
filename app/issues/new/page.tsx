"use client";
import { Button, Callout, Spinner, Text, TextField } from "@radix-ui/themes";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { useState } from "react";
import { IoWarning } from "react-icons/io5";
import ErrorMessage from "@/app/components/ErrorMessage";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
   } = useForm<IssueForm>({
      resolver: zodResolver(createIssueSchema),
   });

   const [error, setError] = useState("");

   const onSubmit = async (values: IssueForm) => {
      try {
         const res = await axios.post("/api/issues", values);
      } catch (err) {
         console.log({ err });
         setError("Unexpected error occured.");
      }
   };
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
         <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
            <div>
               <TextField.Root
                  placeholder="title"
                  {...register("title", { required: false })}
               />
               <ErrorMessage>{errors.title?.message}</ErrorMessage>
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
               <ErrorMessage>{errors.description?.message}</ErrorMessage>
            </div>
            <Button disabled={isSubmitting}>
               Submit new Issue {isSubmitting && <Spinner />}
            </Button>
         </form>
      </div>
   );
};

export default NewIssuePage;
