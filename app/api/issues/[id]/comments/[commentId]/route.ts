import { authOptions } from "@/app/Auth";
import { createCommentSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   { params }: { params: Promise<{ id: string; commentId: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const body = await request.json();

   const validation = createCommentSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const { commentId } = await params;

   const currentComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
   });

   if (!currentComment) return NextResponse.json(currentComment);

   const { comment } = body;
   const res = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { comment },
   });
   return NextResponse.json(res);
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string; commentId: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const { commentId } = await params;

   const currentComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
   });

   if (!currentComment) return NextResponse.json(currentComment);

   const res = await prisma.comment.delete({
      where: { id: parseInt(commentId) },
   });
   return NextResponse.json(res);
}
