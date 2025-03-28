"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";

const Navbar = () => {
   const pathname = usePathname();
   const menuItems = [
      { label: "Dashboard", href: "/" },
      { label: "Issues", href: "/issues" },
   ];
   return (
      <nav className="flex h-14 items-center border-gray-300 border-[1px]">
         <div className="px-5">
            <AiFillBug fontSize={24} />
         </div>
         <ul className="flex gap-6">
            {menuItems.map((menu) => (
               <li
                  className={classNames({
                     "text-zinc-900": pathname === menu.href,
                     "text-zinc-500": pathname !== menu.href,
                     "hover:text-zinc-800 transition-colors": true,
                  })}
                  key={menu.href}
               >
                  <Link href={menu.href}>{menu.label}</Link>
               </li>
            ))}
         </ul>
      </nav>
   );
};

export default Navbar;
