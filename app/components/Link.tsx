import React, { ReactNode } from "react";
import { Link as RadixLink } from "@radix-ui/themes";
import NextLink from "next/link";
const Link = ({ href, children }: { href: string; children: ReactNode }) => {
   return (
      <NextLink href={href} passHref legacyBehavior>
         <RadixLink href={href} className="pointer">
            {children}
         </RadixLink>
      </NextLink>
   );
};

export default Link;
