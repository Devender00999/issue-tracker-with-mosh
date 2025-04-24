import { patchIssueSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession();
   if (!session)
      return NextResponse.json(
         { error: "User is not authenticated" },
         { status: 401 }
      );

   const body = await request.json();
   const validation = patchIssueSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });
   const { id } = await params;
   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });
   if (!issue)
      return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

   const { assignedToUserId, title, description } = body;
   const user = prisma.user.findUnique({ where: { id: assignedToUserId } });

   if (!user)
      return NextResponse.json({ error: "Invalid User" }, { status: 400 });

   const updatedIssue = await prisma.issue.update({
      where: { id: parseInt(id) },
      data: { title, description, assignedToUserId },
   });
   return NextResponse.json({ res: updatedIssue });
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession();
   if (!session)
      return NextResponse.json(
         { error: "User is not authenticated" },
         { status: 401 }
      );

   const { id } = await params;
   const issue = await prisma.issue.findUnique({
      where: { id: parseInt(id) },
   });
   if (!issue)
      return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
   const updatedIssue = await prisma.issue.delete({
      where: { id: parseInt(id) },
   });
   return NextResponse.json({ res: updatedIssue });
}
