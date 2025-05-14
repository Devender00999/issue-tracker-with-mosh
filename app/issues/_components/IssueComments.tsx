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
import CommentItem from "./Comment";
dayjs.extend(relativeTime);

const IssueComments = ({ issueId }: { issueId: number }) => {
   const { data } = useSession();
   const [commentText, setCommentText] = useState("");
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
               comment: commentText,
               issueId,
            });
         } else {
            await axios.patch(`/api/comments/${commentId}`, {
               comment: commentText,
            });
            setCommentId(null);
         }
         refetchComments();
         setCommentText("");
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
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
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
            {comments?.map((currentComment) => (
               <CommentItem
                  comment={currentComment}
                  handleDeleteComment={handleDeleteComment}
                  handleLike={handleLike}
                  isCurrentUser={
                     data?.user?.email === currentComment.user.email
                  }
                  key={currentComment.id}
                  setCommentId={setCommentId}
               />
            ))}
         </Flex>
         <Toaster />
      </Flex>
   );
};

export default IssueComments;
