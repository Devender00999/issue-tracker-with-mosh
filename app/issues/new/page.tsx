"use client";
import { createIssueSchema } from "@/app/validationSchemas";
import dynamic from "next/dynamic";
import { z } from "zod";
import IssueFormSkeleton from "./loading";
const IssueForm = dynamic(() => import("../_components/IssueForm"), {
   loading: () => <IssueFormSkeleton />,
   ssr: !!false,
});
type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
   return (
      <div>
         <IssueForm />
      </div>
   );
};

export default NewIssuePage;
