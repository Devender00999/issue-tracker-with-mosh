"use client";
import {
   Avatar,
   Box,
   Container,
   DropdownMenu,
   Flex,
   Skeleton,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";

const Navbar = () => {
   return (
      <nav className="py-4 px-5 border-b border-gray-200">
         <Container>
            <Flex justify="between">
               <NavLinks />
               <AuthStatus />
            </Flex>
         </Container>
      </nav>
   );
};

const NavLinks = () => {
   const pathname = usePathname();

   const menuItems = [
      { label: "Dashboard", href: "/" },
      { label: "Issues", href: "/issues" },
   ];

   return (
      <Flex align="center" gap="3">
         <Link href="/" className="pl-5">
            <AiFillBug fontSize={24} />
         </Link>
         <ul className="flex gap-6">
            {menuItems.map((menu) => (
               <li
                  className={classNames({
                     "nav-link": true,
                     "!text-zinc-900": pathname === menu.href,
                  })}
                  key={menu.href}
               >
                  <Link href={menu.href}>{menu.label}</Link>
               </li>
            ))}
         </ul>
      </Flex>
   );
};

const AuthStatus = () => {
   const { status, data } = useSession();
   if (status === "loading") return <Skeleton width="3rem" height="2rem" />;

   if (status === "unauthenticated")
      return (
         <Link
            className="nav-link h-8 flex items-center"
            href="/api/auth/signin"
         >
            Login
         </Link>
      );

   return (
      <Box>
         <DropdownMenu.Root>
            <DropdownMenu.Trigger>
               <Avatar
                  src={data!.user!.image!}
                  fallback="?"
                  size="2"
                  radius="full"
                  className="cursor-pointer"
               />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
               <DropdownMenu.Label>{data?.user?.email}</DropdownMenu.Label>
               <DropdownMenu.Item>
                  <Link className="w-full" href="/api/auth/signout">
                     Logout
                  </Link>
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Root>
      </Box>
   );
};

export default Navbar;
