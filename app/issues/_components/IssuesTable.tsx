import { IssueBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Flex, Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { IssueQuery } from "../page";

interface Props {
   searchParams: IssueQuery;
   issues: Issue[];
}

const IssuesTable = ({ searchParams, issues }: Props) => {
   return (
      <Table.Root variant="surface">
         <Table.Header>
            <Table.Row>
               {columns.map((column) => (
                  <Table.ColumnHeaderCell
                     key={column.value}
                     className={`${column.className}`}
                  >
                     <NextLink
                        href={{
                           query: {
                              ...searchParams,
                              orderBy:
                                 searchParams.order != "desc"
                                    ? column.value
                                    : undefined,
                              order:
                                 searchParams.order === "asc"
                                    ? "desc"
                                    : searchParams.order === "desc"
                                    ? undefined
                                    : "asc",
                           },
                        }}
                     >
                        <Flex gap="2">
                           {column.label}
                           {column.value == searchParams.orderBy ? (
                              <Flex
                                 className="inline-flex"
                                 direction="column"
                                 gap="0"
                              >
                                 <AiOutlineCaretUp
                                    color={
                                       searchParams?.order === "asc"
                                          ? "black"
                                          : "#a9a9a9"
                                    }
                                    size={12}
                                    style={{ marginBottom: -4 }}
                                 />
                                 <AiOutlineCaretDown
                                    color={
                                       searchParams?.order === "desc"
                                          ? "black"
                                          : "#a9a9a9"
                                    }
                                    size={12}
                                 />
                              </Flex>
                           ) : (
                              <></>
                           )}
                        </Flex>
                     </NextLink>
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
                  <Table.Cell className="hidden md:table-cell">
                     {issue.assignedToUserId}
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table.Root>
   );
};

const columns: { label: string; value: keyof Issue; className?: string }[] = [
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
   {
      label: "Assignee",
      value: "assignedToUserId",
      className: "hidden md:table-cell",
   },
];

export const columnNames = columns.map((column) => column.value);

export default IssuesTable;
