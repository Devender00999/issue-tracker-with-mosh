import { Comment as CommentType, User } from "@prisma/client";
import { Avatar, Badge, Button, Flex, Text, TextField } from "@radix-ui/themes";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AiFillLike } from "react-icons/ai";

const CommentItem = ({
   comment,
   isCurrentUser,
   handleLike,
   setCommentId,
   handleDeleteComment,
   setCommentText,
   handleReply,
}: {
   comment: CommentType & { user: User };
   isCurrentUser: boolean;
   handleLike: (id: number) => void;
   setCommentId: (id: number) => void;
   handleDeleteComment: (id: number) => void;
   setCommentText: (value: string) => void;
   handleReply: (commentText: string, parentId: number) => void;
}) => {
   const [showReply, setShowReply] = useState(false);
   const [replyText, setReplyText] = useState("");
   const { data } = useSession();

   return (
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
                           {comment.upvotes ? <>{comment.upvotes}</> : ""}
                        </Text>
                     )}
                  </Flex>
               </Badge>
               <>
                  {isCurrentUser && (
                     <Text
                        size="1"
                        style={{ cursor: "pointer" }}
                        weight="medium"
                        onClick={() => {
                           setCommentText(comment.comment);
                           setCommentId(comment.id);
                        }}
                     >
                        Edit
                     </Text>
                  )}

                  <Text
                     size="1"
                     style={{ cursor: "pointer" }}
                     weight="medium"
                     onClick={() => {
                        // setCommentText(comment.comment);
                        // setCommentId(comment.id);
                        setShowReply(true);
                     }}
                  >
                     Reply
                  </Text>

                  {isCurrentUser && (
                     <Text
                        size="1"
                        style={{ cursor: "pointer" }}
                        weight="medium"
                        onClick={() => handleDeleteComment(comment.id)}
                     >
                        Delete
                     </Text>
                  )}
               </>
            </Flex>
            <Flex direction="column" gap="2" className="mt-3">
               {(comment as any).replies?.map(
                  (reply: CommentType & { user: User }) => (
                     <CommentItem
                        key={`${comment.id}-${reply?.id}`}
                        comment={reply}
                        handleDeleteComment={handleDeleteComment}
                        handleLike={handleLike}
                        handleReply={handleReply}
                        isCurrentUser={isCurrentUser}
                        setCommentId={setCommentId}
                        setCommentText={setCommentText}
                     />
                  )
               )}
            </Flex>
            {showReply && (
               <Flex style={{ marginTop: 10 }} gap="10px">
                  <Avatar
                     src={data?.user?.image!}
                     radius="full"
                     fallback="?"
                     size="1"
                     alt="?"
                  />
                  <Flex direction="column" gap="2">
                     <TextField.Root
                        size="2"
                        className="border-0 w-[400px]"
                        placeholder="Enter your reply..."
                        variant="soft"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                     />
                     <Flex gap="2" className="self-end">
                        <Button size="1" onClick={() => setShowReply(false)}>
                           Cancel
                        </Button>
                        <Button
                           onClick={() => {
                              handleReply(replyText, comment.id);
                              setReplyText("");
                           }}
                           size="1"
                        >
                           Reply
                        </Button>
                     </Flex>
                  </Flex>
               </Flex>
            )}
         </Flex>
      </Flex>
   );
};

export default CommentItem;
