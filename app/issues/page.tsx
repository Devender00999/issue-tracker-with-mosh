import { prisma } from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import Pagination from "../components/Pagination";
import IssueActions from "./IssueActions";
import IssuesTable, { columnNames } from "./_components/IssuesTable";
import { Metadata } from "next";

export interface IssueQuery {
   status?: string;
   orderBy: string;
   page?: string;
   limit?: string;
   assigneeId?: string;
}
interface Props {
   searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams: asyncSearchParams }: Props) => {
   const searchParams = await asyncSearchParams;
   const statuses = Object.values(Status);

   const status = statuses.includes(searchParams.status as Status)
      ? searchParams.status
      : undefined;

   const assigneeId = searchParams.assigneeId
      ? searchParams.assigneeId
      : undefined;
   const page = searchParams.page || "1";
   const limit = searchParams.limit || "10";

   const orderBy = columnNames.includes(searchParams.orderBy as keyof Issue)
      ? { [searchParams.orderBy]: "asc" }
      : undefined;

   const issues = await prisma.issue.findMany({
      where: {
         status: status as Status,
         assignedToUserId: assigneeId === "unassigned" ? undefined : assigneeId,
      },
      orderBy: orderBy || { updatedAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
   });
   const totalCount = await prisma.issue.count({
      where: {
         status: status as Status,

         assignedToUserId: assigneeId === "unassigned" ? undefined : assigneeId,
      },
   });

   return (
      <Flex direction="column" gap="4">
         <IssueActions />
         <IssuesTable searchParams={searchParams} issues={issues} />
         <Flex justify="end">
            <Pagination
               currentPage={parseInt(page)}
               itemCounts={totalCount}
               pageSize={parseInt(limit)}
            />
         </Flex>
      </Flex>
   );
};

export const dynamic = "force-dynamic";
export default IssuesPage;

export const metadata: Metadata = {
   title: "Issue Tracker - Issue List",
   description: "View all project issues.",
};
