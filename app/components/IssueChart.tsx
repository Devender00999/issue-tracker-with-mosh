"use client";
import { Card } from "@radix-ui/themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Props {
   open: number;
   inProgress: number;
   closed: number;
}
const IssueChart = ({ open, closed, inProgress }: Props) => {
   const data: { label: string; value: number }[] = [
      { label: "Open", value: open },
      { label: "In Progress", value: inProgress },
      { label: "Closed", value: closed },
   ];
   return (
      <Card>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
               <XAxis dataKey="label" />
               <YAxis />
               <Bar dataKey="value" fill="var(--accent-9)" barSize={60} />
            </BarChart>
         </ResponsiveContainer>
      </Card>
   );
};

export default IssueChart;
