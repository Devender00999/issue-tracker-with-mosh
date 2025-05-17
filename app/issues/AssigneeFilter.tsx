"use client";
import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const AssigneeFilter = ({ assignees }: { assignees: User[] }) => {
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

   return (
      <Select.Root
         onValueChange={(assignee) => {
            const query = createQueryString("assigneeId", assignee);
            router.push(`/issues/?${query}`);
         }}
         value={searchParams.get("assigneeId") || ""}
      >
         <Select.Trigger placeholder="Filter by Assignee..." />
         <Select.Content>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            {assignees.map((user) => (
               <Select.Item key={user.id} value={user.id}>
                  {user.name}
               </Select.Item>
            ))}
         </Select.Content>
      </Select.Root>
   );
};

export default AssigneeFilter;
