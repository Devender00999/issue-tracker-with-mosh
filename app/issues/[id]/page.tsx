import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AssigneeSelect from "../_components/AssigneeSelect";
import DeleteIssueButton from "../_components/DeleteIssueButton";
import EditIssueButton from "../_components/EditIssueButton";
import IssueDetails from "../IssueDetails";
import { Metadata } from "next";
import { cache } from "react";
import UpdateStatus from "../_components/UpdateStatus";
import IssueComments from "../_components/IssueComments";
interface Props {
   params: Promise<{ id: string }>;
}

const fetchIssue = cache((id: string) =>
   prisma.issue.findUnique({
      where: { id: parseInt(id) },
   })
);
const IssuePage = async ({ params }: Props) => {
   const { id } = await params;

   const session = await getServerSession();

   const issue = await fetchIssue(id);

   if (!issue) notFound();

   return (
      <Grid columns={{ initial: "1", sm: "5" }} gap={"30px"}>
         <Flex className="md:col-span-4" direction="column" gap="3">
            <IssueDetails issue={issue} />
            <IssueComments />
         </Flex>
         {session && (
            <Box className="">
               <Flex direction={"column"} gap="4">
                  <UpdateStatus issue={issue} />
                  <AssigneeSelect issue={issue} />
                  <EditIssueButton issueId={issue.id} />
                  <DeleteIssueButton issueId={issue.id} />
               </Flex>
            </Box>
         )}
      </Grid>
   );
};

export default IssuePage;

export const generateMetadata = async ({
   params,
}: Props): Promise<Metadata> => {
   const { id } = await params;
   const issue = await fetchIssue(id);

   return { title: issue?.title, description: issue?.description };
};
