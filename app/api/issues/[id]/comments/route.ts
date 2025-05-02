import { authOptions } from "@/app/Auth";
import { createCommentSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const body = await request.json();
   console.log(request.body, body);
   const validation = createCommentSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const { id } = await params;
   console.log(session.user, session);

   const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
   });

   const { comment } = body;
   const res = await prisma.comment.create({
      data: { comment, userId: user?.id!, issueId: parseInt(id) },
   });
   return NextResponse.json(res);
}

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const { id } = await params;

   const comments = await prisma.comment.findMany({
      where: { issueId: parseInt(id) },
      include: { user: { select: { name: true, image: true, email: true } } },
      orderBy: {
         updatedAt: "desc",
      },
   });

   return NextResponse.json(comments);
}
