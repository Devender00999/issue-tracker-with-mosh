"use client";
import {
   Avatar,
   Button,
   Flex,
   Text,
   TextArea,
   TextField,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const IssueComments = () => {
   const { data } = useSession();
   return (
      <Flex direction="column" gap="3">
         <Text weight="medium" size="4">
            450 Comments
         </Text>
         <Flex width="500px" gap="4">
            <Avatar
               src={data?.user?.image!}
               radius="full"
               fallback="?"
               alt="?"
            />
            <TextArea style={{ flex: 1 }} placeholder="Reply to Deepak…" />

            <Button>Comment</Button>
         </Flex>
      </Flex>
   );
};

export default IssueComments;
