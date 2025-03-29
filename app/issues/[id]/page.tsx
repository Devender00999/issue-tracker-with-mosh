import { IssueBadge } from "@/app/components";
import { prisma } from "@/prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

const IssuePage = async ({ params }: { params: Promise<{ id: string }> }) => {
   const { id } = await params;
   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });

   if (!issue) notFound();

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

export default IssuePage;
