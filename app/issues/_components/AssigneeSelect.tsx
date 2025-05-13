"use client";
import { Issue, Status, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
   const { data: users } = useUsers();
   const router = useRouter();

   const handleAssignIssue = (currentUser: string) =>
      axios
         .patch(`/api/issues/${issue.id}`, {
            assignedToUserId: currentUser == "unassigned" ? null : currentUser,
            status:
               currentUser == "unassigned" ? Status.OPEN : Status.IN_PROGRESS,
         })
         .then(() => {
            router.refresh();
         })
         .catch((err) => {
            console.log(err);
            toast.error("Could not assign issue.");
         });
   return (
      <>
         <Select.Root
            onValueChange={handleAssignIssue}
            disabled={issue.status === "CLOSED"}
            defaultValue={issue.assignedToUserId || ""}
         >
            <Select.Trigger placeholder="Assign..." />
            <Select.Content>
               <Select.Group>
                  <Select.Label>Suggestions</Select.Label>
                  <Select.Item value="unassigned">Unassigned</Select.Item>
                  {users?.map((user) => (
                     <Select.Item key={user.id} value={user.id}>
                        {user.name}
                     </Select.Item>
                  ))}
               </Select.Group>
               <Select.Separator />
            </Select.Content>
         </Select.Root>
         <Toaster />
      </>
   );
};

const useUsers = () =>
   useQuery<User[]>({
      queryKey: ["users"],
      queryFn: () => axios.get("/api/users").then((res) => res.data),
      retry: 3,
      staleTime: 60 * 1000, // 60s
   });

export default AssigneeSelect;
