import { authOptions } from "@/app/Auth";
import { createCommentSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const body = await request.json();
   const validation = createCommentSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
   });

   if (!user) {
      return new Response("User not found", { status: 401 });
   }

   const { comment, issueId } = body;
   const res = await prisma.comment.create({
      data: { comment, userId: user.id, issueId: parseInt(issueId) },
   });

   return NextResponse.json(res);
}

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const issueId = searchParams.get("issueId");
   const comments = await prisma.comment.findMany({
      where: { issueId: parseInt(issueId!) },
      include: { user: { select: { name: true, image: true, email: true } } },
      orderBy: {
         updatedAt: "desc",
      },
   });

   return NextResponse.json(comments);
}
