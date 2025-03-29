import { prisma } from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "../_components/EditIssueButton";
import IssueDetails from "../IssueDetails";
import DeleteIssueButton from "../_components/DeleteIssueButton";

const IssuePage = async ({ params }: { params: Promise<{ id: string }> }) => {
   const { id } = await params;
   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });

   if (!issue) notFound();

   return (
      <Grid columns={{ initial: "1", sm: "5" }} gap={"30px"}>
         <Box className="md:col-span-4">
            <IssueDetails issue={issue} />
         </Box>
         <Box className="">
            <Flex direction={"column"} gap="4">
               <EditIssueButton issueId={issue.id} />
               <DeleteIssueButton issueId={issue.id} />
            </Flex>
         </Box>
      </Grid>
   );
};

export default IssuePage;
