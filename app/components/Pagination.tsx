"use client";
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DoubleArrowLeftIcon,
   DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Select, Separator, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
interface Props {
   itemCounts: number;
   pageSize: number;
   currentPage: number;
}
const Pagination = ({ currentPage, itemCounts, pageSize }: Props) => {
   const searchParams = useSearchParams();
   const router = useRouter();

   const handleChangePage = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push("?" + params.toString());
   };

   const handleChangeLimit = (limit: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      params.set("limit", limit);
      router.push("?" + params.toString());
   };
   const pageCount = Math.ceil(itemCounts / pageSize);
   if (pageCount < 0) return null;

   return (
      <Flex align="center" gap="2">
         <Text size="2">
            Page {currentPage} of {pageCount}
         </Text>
         <Button
            onClick={() => handleChangePage(1)}
            disabled={currentPage == 1}
            color="gray"
            variant="soft"
         >
            <DoubleArrowLeftIcon />
         </Button>
         <Button
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage == 1}
            color="gray"
            variant="soft"
         >
            <ChevronLeftIcon />
         </Button>
         {Array.from(new Array(pageCount)).map((i, idx) => (
            <Button
               onClick={() => handleChangePage(idx + 1)}
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
            onClick={() => handleChangePage(currentPage + 1)}
         >
            <ChevronRightIcon />
         </Button>
         <Button
            disabled={currentPage == pageCount}
            color="gray"
            variant="soft"
            onClick={() => handleChangePage(pageCount)}
         >
            <DoubleArrowRightIcon />
         </Button>
         <Separator mx="3" orientation="vertical" />
         <Flex gap="4" align="center">
            <Text size="2">Page Size</Text>
            <Select.Root
               onValueChange={(value) => handleChangeLimit(value)}
               defaultValue={pageSize.toString()}
            >
               <Select.Trigger placeholder=""></Select.Trigger>
               <Select.Content>
                  <Select.Item value="10">10</Select.Item>
                  <Select.Item value="20">20</Select.Item>
                  <Select.Item value="30">30</Select.Item>
               </Select.Content>
            </Select.Root>
         </Flex>
      </Flex>
   );
};

export default Pagination;
