import React from "react";
import IssueActions from "./IssueActions";
import { Flex, Skeleton, Table } from "@radix-ui/themes";

const LoadingIssuesPage = () => {
   const issues = Array.from(new Array(10));
   return (
      <Flex gap="4" direction="column">
         <IssueActions />
         <Table.Root variant="surface">
            <Table.Header>
               <Table.Row>
                  <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden md:table-cell">
                     Status
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden md:table-cell">
                     Created
                  </Table.ColumnHeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
               {issues.map((issue, idx) => (
                  <Table.Row key={idx}>
                     <Table.Cell>
                        <Skeleton height={"20px"} />
                     </Table.Cell>
                     <Table.Cell className="hidden md:table-cell">
                        <Skeleton height={"20px"} />
                     </Table.Cell>
                     <Table.Cell className="hidden md:table-cell">
                        <Skeleton height={"20px"} />
                     </Table.Cell>
                  </Table.Row>
               ))}
            </Table.Body>
         </Table.Root>
      </Flex>
   );
};

export default LoadingIssuesPage;
