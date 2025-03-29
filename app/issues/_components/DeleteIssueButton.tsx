"use client";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState(false);
   const router = useRouter();

   const handleDeleteIssue = async () => {
      try {
         setIsDeleting(true);
         await axios.delete("/api/issues/" + issueId);
         setIsDeleting(false);
         router.push("/issues");
         router.refresh();
      } catch (err) {
         console.log({ err });
         setIsDeleting(false);
         setError(true);
      }
   };
   return (
      <>
         <AlertDialog.Root>
            <AlertDialog.Trigger>
               <Button color="red" loading={isDeleting}>
                  Delete Issue
               </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
               <AlertDialog.Title>Delete issue</AlertDialog.Title>
               <AlertDialog.Description size="2">
                  Are you sure? This issue will not be accessible.
               </AlertDialog.Description>

               <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                     <Button variant="soft" color="gray">
                        Cancel
                     </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                     <Button
                        loading={isDeleting}
                        onClick={handleDeleteIssue}
                        variant="solid"
                        color="red"
                     >
                        Delete issue
                     </Button>
                  </AlertDialog.Action>
               </Flex>
            </AlertDialog.Content>
         </AlertDialog.Root>
         <AlertDialog.Root open={error}>
            <AlertDialog.Content maxWidth="450px">
               <AlertDialog.Title>Error Occured</AlertDialog.Title>
               <AlertDialog.Description size="2">
                  Issue cannot be deleted because of unexpected error.
               </AlertDialog.Description>

               <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                     <Button
                        onClick={() => setError(false)}
                        variant="soft"
                        color="gray"
                     >
                        OK
                     </Button>
                  </AlertDialog.Cancel>
               </Flex>
            </AlertDialog.Content>
         </AlertDialog.Root>
      </>
   );
};

export default DeleteIssueButton;
