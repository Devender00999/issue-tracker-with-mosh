"use client";
import { Comment, User } from "@prisma/client";
import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CommentItem from "./Comment";
import CommentInput from "./CommentInput";
dayjs.extend(relativeTime);

const IssueComments = ({ issueId }: { issueId: number }) => {
   const { data } = useSession();
   const {
      data: comments,
      refetch: refetchComments,
      isLoading: loadingComments,
   } = useQuery<(Comment & { user: User })[]>({
      queryKey: ["issues", issueId, "comments"],
      queryFn: () =>
         axios.get(`/api/comments?issueId=` + issueId).then((res) => res.data),
   });

   const { mutateAsync: createComment, isPending: isAddingComment } =
      useMutation({
         mutationFn: ({
            comment,
            issueId,
         }: {
            comment: string;
            issueId: number;
         }) =>
            axios.post(`/api/comments`, {
               comment,
               issueId,
            }),
      });

   const { mutateAsync: likeComment } = useMutation({
      mutationFn: ({ commentId }: { commentId: number }) => {
         console.log(commentId);
         return axios.post(`/api/comments/${commentId}/likes`, {});
      },
   });

   const { mutateAsync: updateComment, isPending: isUpdatingComment } =
      useMutation({
         mutationFn: ({
            comment,
            commentId,
         }: {
            comment: string;
            commentId: number;
         }) =>
            axios.patch(`/api/comments/${commentId}`, {
               comment,
            }),
      });

   const router = useRouter();

   const [commentId, setCommentId] = useState<null | number>(null);
   const [commentText, setCommentText] = useState("");

   const handleLike = async (commentId: number) => {
      try {
         if (!data?.user?.email) {
            router.push("/api/auth/signin");
         }
         await likeComment({ commentId });
         router.refresh();
         refetchComments();
      } catch (err) {
         console.log(err);
      }
   };

   const handleCreateComment = async (commentText: string) => {
      try {
         if (!commentId) {
            await createComment({ comment: commentText, issueId });
         } else {
            await updateComment({ comment: commentText, commentId });
            setCommentId(null);
         }
         refetchComments();
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

   return loadingComments ? (
      <Flex direction="column" gap="2">
         <Skeleton height="24px" width="250px" />
         <Skeleton height="24px" width="150px" />
         <Skeleton height="24px" width="100px" />
      </Flex>
   ) : (
      <Flex direction="column" gap="3">
         <Text weight="medium" size="4">
            {comments?.length
               ? `${comments.length} Comments`
               : "No Comments available"}
         </Text>
         <CommentInput
            commentId={commentId}
            handleCreateComment={handleCreateComment}
            commentText={commentText}
            setCommentText={setCommentText}
            isAddingComment={isAddingComment || isUpdatingComment}
         />
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
                  setCommentText={setCommentText}
               />
            ))}
         </Flex>
         <Toaster />
      </Flex>
   );
};

export default IssueComments;
