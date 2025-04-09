import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import DeleteIssueButton from "../_components/DeleteIssueButton";
import EditIssueButton from "../_components/EditIssueButton";
import IssueDetails from "../IssueDetails";
import AssigneeSelect from "../_components/AssigneeSelect";

const IssuePage = async ({ params }: { params: Promise<{ id: string }> }) => {
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
                  <AssigneeSelect />
                  <EditIssueButton issueId={issue.id} />
                  <DeleteIssueButton issueId={issue.id} />
               </Flex>
            </Box>
         )}
      </Grid>
   );
};

export default IssuePage;
