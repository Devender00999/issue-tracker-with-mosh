import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession();
   if (!session?.user)
      return NextResponse.json({ message: "Unautherised" }, { status: 401 });

   const { id } = await params;
   const likedComment = await prisma.likedComment.findFirst({
      where: { commentId: parseInt(id), user: { email: session.user.email! } },
   });

   let res;
   if (likedComment) {
      res = await prisma.likedComment.delete({
         where: { id: likedComment.id },
      });
      await prisma.comment.update({
         where: { id: parseInt(id) },
         data: { upvotes: { decrement: 1 } },
      });
   } else {
      const comment = await prisma.comment.update({
         where: { id: parseInt(id) },
         data: { upvotes: { increment: 1 } },
      });

      const user = await prisma.user.findUnique({
         where: { email: session.user.email! },
      });

      if (!user)
         return NextResponse.json({ message: "Unautherised" }, { status: 401 });

      res = await prisma.likedComment.create({
         data: { commentId: comment.id, userId: user.id! },
      });
   }

   return NextResponse.json(res);
}
