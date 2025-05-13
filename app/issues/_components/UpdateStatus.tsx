"use client";
import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const UpdateStatus = ({ issue }: { issue: Issue }) => {
   const statusOptions: { label: string; value: Status }[] = [
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Closed", value: "CLOSED" },
   ];

   const router = useRouter();

   const handleUpdateStatus = async (status: Status) => {
      await axios.patch(`/api/issues/${issue.id}`, { status: status });
      router.refresh();
   };

   return (
      <Select.Root
         defaultValue={issue.status}
         onValueChange={handleUpdateStatus}
         disabled={issue.status === "CLOSED"}
      >
         <Select.Trigger />
         <Select.Content>
            {statusOptions?.map((status) => (
               <Select.Item key={status.value} value={status.value}>
                  {status.label}
               </Select.Item>
            ))}
         </Select.Content>
      </Select.Root>
   );
};

export default UpdateStatus;
