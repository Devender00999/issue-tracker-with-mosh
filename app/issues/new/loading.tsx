import { Skeleton } from "@radix-ui/themes";
import React from "react";

const NewIssueLoadingPage = () => {
   return (
      <div className="max-w-xl space-y-5">
         <div>
            <Skeleton loading height="1.8rem" />
         </div>

         <div>
            <Skeleton height="25rem" />
         </div>
         <Skeleton height="1.8rem" width="4rem" />
      </div>
   );
};

export default NewIssueLoadingPage;
