import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ commentId: string }> }
) {
   const { commentId } = await params;
   console.log(commentId);
   const res = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { upvotes: { increment: 1 } },
   });
   return NextResponse.json(res);
}
