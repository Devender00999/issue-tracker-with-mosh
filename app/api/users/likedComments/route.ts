import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   const session = await getServerSession();
   if (!session?.user)
      return NextResponse.json({ message: "Unautherised" }, { status: 401 });
   const likedComments = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: {
         likedComments: true,
      },
   });
   return NextResponse.json(likedComments);
};
