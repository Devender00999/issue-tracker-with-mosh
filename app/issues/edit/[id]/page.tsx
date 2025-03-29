import { prisma } from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import IssueFormSkeleton from "./loading";

const IssueForm = dynamic(() => import("../../_components/IssueForm"), {
   loading: () => <IssueFormSkeleton />,
   ssr: !!false,
});

const EditIssuePage = async ({
   params,
}: {
   params: Promise<{ id: string }>;
}) => {
   const { id } = await params;
   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });

   if (!issue) notFound();
   return (
      <div>
         <IssueForm issue={issue} />
      </div>
   );
};

export default EditIssuePage;
