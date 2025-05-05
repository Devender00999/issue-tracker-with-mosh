import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ issueId: string }> }
) {
   const { issueId } = await params;

   const comments = await prisma.comment.findMany({
      where: { issueId: parseInt(issueId) },
      include: { user: { select: { name: true, image: true, email: true } } },
      orderBy: {
         updatedAt: "desc",
      },
   });

   return NextResponse.json(comments);
}
