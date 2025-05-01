import { authOptions } from "@/app/Auth";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//    const res = request.body;
//    return res;
// }

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const { id } = await params;

   const comments = await prisma.comment.findMany({
      where: { issueId: parseInt(id) },
   });

   return NextResponse.json(comments);
}
