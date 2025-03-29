"use client";
import { ErrorMessage } from "@/app/components";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Spinner, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoWarning } from "react-icons/io5";
import { z } from "zod";
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
   ssr: false,
});

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
               <>{errors.title?.message}</>
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
