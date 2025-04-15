import { Button, Flex, Text } from "@radix-ui/themes";
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DoubleArrowLeftIcon,
   DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import React from "react";
interface Props {
   itemCounts: number;
   pageSize: number;
   currentPage: number;
}
const Pagination = ({ currentPage, itemCounts, pageSize }: Props) => {
   const pageCount = Math.ceil(itemCounts / pageSize);
   if (pageCount < 0) return null;

   return (
      <Flex align="center" gap="2">
         <Text size="2">
            Page {currentPage} of {pageCount}
         </Text>
         <Button disabled={currentPage == 1} color="gray" variant="soft">
            <DoubleArrowLeftIcon />
         </Button>
         <Button disabled={currentPage == 1} color="gray" variant="soft">
            <ChevronLeftIcon />
         </Button>
         {Array.from(new Array(pageCount)).map((i, idx) => (
            <Button
               className={`${currentPage == idx + 1 ? "bg-red-400" : ""}`}
               key={idx}
               color={currentPage == idx + 1 ? "blue" : "gray"}
               variant="soft"
            >
               {idx + 1}
            </Button>
         ))}
         <Button
            disabled={currentPage == pageCount}
            color="gray"
            variant="soft"
         >
            <ChevronRightIcon />
         </Button>

         <Button
            disabled={currentPage == pageCount}
            color="gray"
            variant="soft"
         >
            <DoubleArrowRightIcon />
         </Button>
      </Flex>
   );
};

export default Pagination;
