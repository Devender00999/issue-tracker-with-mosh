import { prisma } from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import React from "react";
import IssueBadge from "./IssueBadge";
import Link from "next/link";

const LatestIssues = async () => {
   const issues = await prisma.issue.findMany({
      take: 5,
      include: { assignedToUser: true },
   });
   return (
      <Card>
         <Heading size="4" className="px-2 mb-2">Latest issues</Heading>
         <Table.Root>
            <Table.Body>
               {issues.map((issue) => (
                  <Table.Row
                     className="last:border-0 last:border-hidden"
                     key={issue.id}
                  >
                     <Table.Cell>
                        <Flex justify="between" align="center">
                           <Flex direction="column" align="start" gap="2">
                              <Link href={`/issues/${issue.id}`}>
                                 {issue.title}
                              </Link>
                              <IssueBadge status={issue.status} />
                           </Flex>
                           {issue.assignedToUser && (
                              <Avatar
                                 size="2"
                                 fallback="?"
                                 src={issue.assignedToUser?.image!}
                                 radius="full"
                              />
                           )}
                        </Flex>
                     </Table.Cell>
                  </Table.Row>
               ))}
            </Table.Body>
         </Table.Root>
      </Card>
   );
};

export default LatestIssues;
