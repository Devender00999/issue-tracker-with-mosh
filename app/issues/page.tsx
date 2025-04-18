import { prisma } from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import Pagination from "../components/Pagination";
import IssueActions from "./IssueActions";
import IssuesTable, { columnNames } from "./_components/IssuesTable";

export interface IssueQuery {
   status?: string;
   orderBy: string;
   page?: string;
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
   const page = searchParams.page || "1";

   const pageSize = 10;

   const orderBy = columnNames.includes(searchParams.orderBy as keyof Issue)
      ? { [searchParams.orderBy]: "asc" }
      : undefined;

   const issues = await prisma.issue.findMany({
      where: { status: status as Status },
      orderBy,
      skip: (parseInt(page) - 1) * pageSize,
      take: pageSize,
   });
   const totalCount = await prisma.issue.count({
      where: { status: status as Status },
   });

   return (
      <Flex direction="column" gap="4">
         <IssueActions />
         <IssuesTable searchParams={searchParams} issues={issues} />
         <Flex justify="end">
            <Pagination
               currentPage={parseInt(page)}
               itemCounts={totalCount}
               pageSize={pageSize}
            />
         </Flex>
      </Flex>
   );
};

export const dynamic = "force-dynamic";
export default IssuesPage;
