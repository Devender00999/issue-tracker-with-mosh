import { Flex, Avatar, TextArea, Button } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const CommentInput = ({
   commentId,
   handleCreateComment,
}: {
   commentId: number | null;
   handleCreateComment: (text: string) => void;
}) => {
   const { data } = useSession();
   const [commentText, setCommentText] = useState("");
   if (!data?.user) return <></>;

   return (
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
                  onClick={() => {
                     handleCreateComment(commentText);
                     setCommentText(commentText);
                  }}
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
   );
};

export default CommentInput;
