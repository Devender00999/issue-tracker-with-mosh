import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
   return (
      <Link className="w-full" href={`/issues/edit/${issueId}`}>
         <Button className="w-full!">Edit Issue</Button>
      </Link>
   );
};

export default EditIssueButton;
