import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
   const session = await getServerSession();
   if (!session?.user)
      return NextResponse.json({ message: "Unautherised" }, { status: 401 });
   const likedComments = await prisma.likedComment.findMany({});
   return NextResponse.json(likedComments);
};
