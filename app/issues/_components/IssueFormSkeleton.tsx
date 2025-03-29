import { Skeleton } from "@radix-ui/themes";
import React from "react";

const IssueFormSkeleton = () => {
   return (
      <div className="max-w-xl space-y-5">
         <div>
            <Skeleton loading height="1.8rem" />
         </div>
         <div>
            <Skeleton loading height="25rem" />
         </div>
         <Skeleton loading height="1.8rem" width="4rem" />
      </div>
   );
};

export default IssueFormSkeleton;
