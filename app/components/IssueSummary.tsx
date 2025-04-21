import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
   open: number;
   inProgress: number;
   closed: number;
}
const IssueSummary = ({ open, closed, inProgress }: Props) => {
   const summaries: { label: string; value: number; status: Status }[] = [
      { label: "Open Issues", value: open, status: "OPEN" },
      { label: "In-progress issues", value: inProgress, status: "IN_PROGRESS" },
      { label: "Closed Issues", value: closed, status: "CLOSED" },
   ];
   return (
      <Flex gap="4">
         {summaries?.map((summary) => (
            <Card key={summary.status}>
               <Flex direction="column" className="px-2" gap="1">
                  <Link
                     className="text-sm font-medium"
                     href={`/issues?status=${summary.status}`}
                  >
                     {summary.label}
                  </Link>
                  <Text size="6" weight="medium">
                     {summary.value}
                  </Text>
               </Flex>
            </Card>
         ))}
      </Flex>
   );
};

export default IssueSummary;
