"use client";
import { ErrorMessage } from "@/app/components";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Spinner, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoWarning } from "react-icons/io5";
import SimpleMdeReact from "react-simplemde-editor";

import { Issue } from "@prisma/client";
import { useRouter } from "next/navigation";
import { z } from "zod";

type IssueFormData = z.infer<typeof createIssueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
   } = useForm<IssueFormData>({
      resolver: zodResolver(createIssueSchema),
   });

   const router = useRouter();

   const [error, setError] = useState("");

   const onSubmit = async (values: IssueFormData) => {
      try {
         if (issue) {
            await axios.patch(`/api/issues/${issue.id}`, values);
         } else {
            await axios.post("/api/issues", values);
         }
         router.push("/issues");
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
                  defaultValue={issue?.title}
                  {...register("title", { required: false })}
               />
               <>{errors.title?.message}</>
            </div>

            <div>
               <Controller
                  control={control}
                  name="description"
                  defaultValue={issue?.description}
                  render={({ field }) => (
                     <SimpleMdeReact
                        defaultValue={issue?.description}
                        placeholder="description"
                        {...field}
                     />
                  )}
               />
               <ErrorMessage>{errors.description?.message}</ErrorMessage>
            </div>
            <Button disabled={isSubmitting}>
               {issue ? "Update issue" : "Submit new Issue"}{" "}
               {isSubmitting && <Spinner />}
            </Button>
         </form>
      </div>
   );
};

export default IssueForm;
