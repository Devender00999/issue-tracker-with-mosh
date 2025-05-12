"use client";
import { Comment, LikedComment, User } from "@prisma/client";
import { Avatar, Badge, Button, Flex, Text, TextArea } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
         axios.get(`/api/comments?issueId=` + issueId).then((res) => res.data),
   });

   const router = useRouter();

   const [commentId, setCommentId] = useState<null | number>(null);

   const handleLike = async (commentId: number) => {
      try {
         if (!data?.user?.email) {
            router.push("/api/auth/signin");
         }
         await axios.post(`/api/comments/${commentId}/likes`, {});
         router.refresh();
         refetchComments();
      } catch (err) {
         console.log(err);
      }
   };

   const handleCreateComment = async () => {
      try {
         if (!commentId) {
            await axios.post(`/api/comments`, {
               comment,
               issueId,
            });
         } else {
            await axios.patch(`/api/comments/${commentId}`, {
               comment,
            });
            setCommentId(null);
         }
         refetchComments();
         setComment("");
      } catch (err) {
         console.log(err);
      }
   };

   const handleDeleteComment = async (commentId: number) => {
      try {
         await axios.delete(`/api/comments/${commentId}`);
         refetchComments();
         toast.success("Comment deleted successfully.");
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
                        {commentId ? "Update" : "Post"} comment
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
                           {dayjs(comment.createdAt).fromNow()}
                        </Text>
                     </Flex>
                     <Text style={{ maxWidth: 400 }} size="2">
                        {comment.comment}
                     </Text>
                     <Flex gap="3" style={{ marginTop: 5 }} align="center">
                        <Badge variant="solid" radius="full">
                           <Flex align="center" justify="center" gap="1">
                              <AiFillLike
                                 onClick={() => handleLike(comment.id)}
                                 cursor={"pointer"}
                                 fontSize={14}
                              />
                              {!!comment.upvotes && (
                                 <Text style={{ fontSize: "9px" }}>
                                    {comment.upvotes ? (
                                       <>{comment.upvotes}</>
                                    ) : (
                                       ""
                                    )}
                                 </Text>
                              )}
                           </Flex>
                        </Badge>
                        {data?.user?.email === comment.user.email && (
                           <>
                              <Text
                                 size="1"
                                 style={{ cursor: "pointer" }}
                                 weight="medium"
                                 onClick={() => {
                                    setComment(comment.comment);
                                    setCommentId(comment.id);
                                 }}
                              >
                                 Edit
                              </Text>
                              <Text
                                 size="1"
                                 style={{ cursor: "pointer" }}
                                 weight="medium"
                                 onClick={() => handleDeleteComment(comment.id)}
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
         <Toaster />
      </Flex>
   );
};

export default IssueComments;
