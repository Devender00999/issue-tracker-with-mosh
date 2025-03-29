import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { IoPencil } from "react-icons/io5";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
   return (
      <Link href={`/issues/edit/${issueId}`}>
         <Button>
            <IoPencil></IoPencil>Edit Issue
         </Button>
      </Link>
   );
};

export default EditIssueButton;
