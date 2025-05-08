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
   const res = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { upvotes: { increment: 1 } },
   });

   await prisma.user.update({
      where: { email: session.user.email! },
      data: { likedComments: { connect: { id: res.id } } },
   });
   return NextResponse.json(res);
}
