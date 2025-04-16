import { prisma } from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Flex, Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { IoArrowUp } from "react-icons/io5";
import { IssueBadge, Link } from "../components";
import Pagination from "../components/Pagination";
import IssueActions from "./IssueActions";
// import { useSearchParams } from "next/navigation";

const IssuesPage = async ({
   searchParams,
}: {
   searchParams: Promise<{ status?: string; orderBy: string; page?: string }>;
}) => {
   const currentSearchParams = await searchParams;
   const statuses = Object.values(Status);
   const status = statuses.includes(currentSearchParams.status as Status)
      ? currentSearchParams.status
      : undefined;
   const page = currentSearchParams.page || "1";

   const columns: { label: string; value: keyof Issue; className?: string }[] =
      [
         { label: "Issue", value: "title" },
         {
            label: "Status",
            value: "status",
            className: "hidden md:table-cell",
         },
         {
            label: "Created",
            value: "createdAt",
            className: "hidden md:table-cell",
         },
      ];

   const pageSize = 10;

   const orderBy = columns
      ?.map((column) => column.value)
      .includes(currentSearchParams.orderBy as keyof Issue)
      ? { [currentSearchParams.orderBy]: "asc" }
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
         <Table.Root variant="surface">
            <Table.Header>
               <Table.Row>
                  {columns.map((column) => (
                     <Table.ColumnHeaderCell
                        key={column.value}
                        className={column.className}
                     >
                        <NextLink
                           href={{
                              query: {
                                 ...currentSearchParams,
                                 orderBy: column.value,
                              },
                           }}
                        >
                           {column.label}
                        </NextLink>
                        {column.value == currentSearchParams.orderBy ? (
                           <IoArrowUp className="inline" />
                        ) : (
                           <></>
                        )}
                     </Table.ColumnHeaderCell>
                  ))}
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {issues.map((issue) => (
                  <Table.Row key={issue.id}>
                     <Table.Cell>
                        <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                        <p className="md:hidden">
                           <IssueBadge status={issue.status} />
                        </p>
                     </Table.Cell>
                     <Table.Cell className="hidden md:table-cell">
                        <IssueBadge status={issue.status} />
                     </Table.Cell>
                     <Table.Cell className="hidden md:table-cell">
                        {issue.createdAt.toDateString()}
                     </Table.Cell>
                  </Table.Row>
               ))}
            </Table.Body>
         </Table.Root>
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
