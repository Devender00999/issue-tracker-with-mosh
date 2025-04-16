"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

const IssueStatusFilter = () => {
   const router = useRouter();
   const searchParams = useSearchParams();

   const createQueryString = useCallback(
      (name: string, value: string) => {
         const params = new URLSearchParams(searchParams.toString());
         params.set(name, value);

         return params.toString();
      },
      [searchParams]
   );

   const statusOptions: { label: string; value?: Status }[] = [
      { label: "All" },
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Closed", value: "CLOSED" },
   ];

   return (
      <Select.Root
         onValueChange={(status) => {
            const query = createQueryString(
               "status",
               status != "ALL" ? `${status}` : ""
            );
            router.push(`/issues/?${query}`);
         }}
         value={searchParams.get("status") || ""}
      >
         <Select.Trigger placeholder="Filter by status..." />
         <Select.Content>
            {statusOptions.map((status) => (
               <Select.Item key={status.label} value={status.value || "ALL"}>
                  {status.label}
               </Select.Item>
            ))}
         </Select.Content>
      </Select.Root>
   );
};

export default IssueStatusFilter;
