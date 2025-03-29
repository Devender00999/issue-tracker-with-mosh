import { Heading, Flex, Card, Text } from "@radix-ui/themes";
import React from "react";
import Markdown from "react-markdown";
import { IssueBadge } from "../components";
import { Issue } from "@prisma/client";

const IssueDetails = ({ issue }: { issue: Issue }) => {
   return (
      <div className="space-y-3">
         <Heading as="h2">{issue?.title}</Heading>
         <Flex gap="12px" className="mt-1 items-center">
            <IssueBadge status={issue?.status || "OPEN"} />
            <Text>{issue.createdAt.toDateString()}</Text>
         </Flex>
         <Card className="prose">
            <Markdown>{issue.description}</Markdown>
         </Card>
      </div>
   );
};

export default IssueDetails;
