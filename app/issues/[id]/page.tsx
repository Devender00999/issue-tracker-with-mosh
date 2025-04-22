import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AssigneeSelect from "../_components/AssigneeSelect";
import DeleteIssueButton from "../_components/DeleteIssueButton";
import EditIssueButton from "../_components/EditIssueButton";
import IssueDetails from "../IssueDetails";
import { Metadata } from "next";
interface Props {
   params: Promise<{ id: string }>;
}
const IssuePage = async ({ params }: Props) => {
   const { id } = await params;

   const session = await getServerSession();

   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });

   if (!issue) notFound();

   return (
      <Grid columns={{ initial: "1", sm: "5" }} gap={"30px"}>
         <Box className="md:col-span-4">
            <IssueDetails issue={issue} />
         </Box>
         {session && (
            <Box className="">
               <Flex direction={"column"} gap="4">
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
   const issue = await prisma.issue.findUnique({ where: { id: parseInt(id) } });

   return { title: issue?.title, description: issue?.description };
};
