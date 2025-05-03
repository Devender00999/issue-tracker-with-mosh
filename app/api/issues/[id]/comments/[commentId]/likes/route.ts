import { prisma } from "@/prisma/client";
import { NextRequest } from "next/server";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ commentId: string }> }
) {
   const { commentId } = await params;
   prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { upvotes: { increment: 1 } },
   });
}
