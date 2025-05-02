"use client";
import { Comment, User } from "@prisma/client";
import {
   Avatar,
   Button,
   Flex,
   Separator,
   Text,
   TextArea,
   TextField,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillLike } from "react-icons/ai";
dayjs.extend(relativeTime);

const IssueComments = ({ issueId }: { issueId: number }) => {
   const { data } = useSession();
   const [comment, setComment] = useState("");
   const { data: comments, refetch: refetchComments } = useQuery<
      (Comment & { user: User })[]
   >({
      queryKey: ["issues", issueId, "comments"],
      queryFn: () =>
         axios.get(`/api/issues/${issueId}/comments`).then((res) => res.data),
   });

   const handleCreateComment = async () => {
      try {
         await axios.post(`/api/issues/${issueId}/comments`, {
            comment,
         });
         refetchComments();
         setComment("");
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <Flex direction="column" gap="3">
         <Text weight="medium" size="4">
            {comments?.length
               ? `${comments.length} Comments`
               : "No Comments available"}
         </Text>

         {data?.user && (
            <>
               <Flex width="100%" gap="4">
                  <Avatar
                     src={data?.user?.image!}
                     radius="full"
                     fallback="?"
                     alt="?"
                  />
                  <Flex width="100%" direction="column" gap="3">
                     <TextArea
                        style={{ width: "100%", maxWidth: 500 }}
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                     />
                     <Button
                        onClick={handleCreateComment}
                        style={{ width: "max-content" }}
                     >
                        Post comment
                     </Button>
                  </Flex>
               </Flex>
               <hr
                  style={{
                     margin: "10px 0",
                     borderColor: "#cfcfca",
                     maxWidth: 500,
                  }}
               />
            </>
         )}
         <Flex direction="column" gap="5">
            {comments?.map((comment) => (
               <Flex width="100%" gap="4" key={comment.id}>
                  <Avatar
                     src={comment.user.image!}
                     radius="full"
                     fallback="?"
                     size="2"
                     alt="?"
                  />
                  <Flex width="100%" direction="column" gap="2px">
                     <Flex align="baseline" gap="1">
                        <Text size="2" weight="medium">
                           @
                           {comment.user.email?.slice(
                              0,
                              comment.user.email.indexOf("@")
                           )}
                        </Text>
                        <Text size="1" color="gray" weight="medium">
                           {dayjs(comment.updatedAt).fromNow()}
                        </Text>
                     </Flex>
                     <Text style={{ maxWidth: 400 }} size="2">
                        {comment.comment}
                     </Text>
                     <Flex gap="3" style={{ marginTop: 5 }} align="center">
                        <AiFillLike
                           color="var(--accent-9)"
                           cursor={"pointer"}
                        />

                        <Text
                           size="1"
                           style={{ cursor: "pointer" }}
                           weight="medium"
                        >
                           Reply
                        </Text>
                        {data?.user?.email === comment.user.email && (
                           <>
                              <Text
                                 size="1"
                                 style={{ cursor: "pointer" }}
                                 weight="medium"
                              >
                                 Edit
                              </Text>
                              <Text
                                 size="1"
                                 style={{ cursor: "pointer" }}
                                 weight="medium"
                              >
                                 Delete
                              </Text>
                           </>
                        )}
                     </Flex>
                  </Flex>
               </Flex>
            ))}
         </Flex>
      </Flex>
   );
};

export default IssueComments;
