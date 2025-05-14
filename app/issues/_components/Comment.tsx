import { Comment as CommentType, User } from "@prisma/client";
import { Avatar, Badge, Flex, Text } from "@radix-ui/themes";
import dayjs from "dayjs";
import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";

const CommentItem = ({
   comment,
   isCurrentUser,
   handleLike,
   setCommentId,
   handleDeleteComment,
}: {
   comment: CommentType & { user: User };
   isCurrentUser: boolean;
   handleLike: (id: number) => void;
   setCommentId: (id: number) => void;
   handleDeleteComment: (id: number) => void;
}) => {
   const [commentText, setCommentText] = useState("");
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
               {isCurrentUser && (
                  <>
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
   );
};

export default CommentItem;
