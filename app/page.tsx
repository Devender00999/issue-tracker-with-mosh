import { prisma } from "@/prisma/client";
import { Flex, Grid } from "@radix-ui/themes";
import IssueSummary from "./components/IssueSummary";
import LatestIssues from "./components/LatestIssues";
import IssueChart from "./components/IssueChart";
import { Metadata } from "next";

export default async function Home() {
   const open = await prisma.issue.count({ where: { status: "OPEN" } });
   const inProgress = await prisma.issue.count({
      where: { status: "IN_PROGRESS" },
   });
   const closed = await prisma.issue.count({ where: { status: "CLOSED" } });

   return (
      <Grid columns={{ initial: "1", md: "2" }} gap="5">
         <Flex direction="column" gap="5">
            <IssueSummary open={open} closed={closed} inProgress={inProgress} />
            <IssueChart open={open} closed={closed} inProgress={inProgress} />
         </Flex>{" "}
         <LatestIssues />
      </Grid>
   );
}

export const metadata: Metadata = {
   title: "Issue Tracker - Dashboard",
   description: "View a summary of project issues.",
};

export const revalidate = 0;
