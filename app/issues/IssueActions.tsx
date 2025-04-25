import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusFilter from "./IssueStatusFilter";
import AssigneeFilter from "./AssigneeFilter";
import { prisma } from "@/prisma/client";

const IssueActions = async () => {
   const users = await prisma.user.findMany();
   return (
      <Flex justify="between" gap="4">
         <Flex gap="4">
            <IssueStatusFilter />
            <AssigneeFilter assignees={users} />
         </Flex>
         <Link href="issues/new">
            <Button>New Issue</Button>
         </Link>
      </Flex>
   );
};

export default IssueActions;
