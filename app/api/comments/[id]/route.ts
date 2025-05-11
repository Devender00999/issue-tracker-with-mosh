import { authOptions } from "@/app/Auth";
import { updateCommentSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const body = await request.json();

   const validation = updateCommentSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const { id: id } = await params;

   const currentComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
   });

   if (!currentComment) return NextResponse.json(currentComment);

   const { comment } = body;
   const res = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { comment },
   });
   return NextResponse.json(res);
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
   }

   const { id } = await params;

   const currentComment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
   });

   await prisma.likedComment.deleteMany({ where: { commentId: parseInt(id) } });

   if (!currentComment) return NextResponse.json(currentComment);

   const res = await prisma.comment.delete({
      where: { id: parseInt(id) },
   });
   return NextResponse.json(res);
}
