import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createIssueSchema } from "@/app/validationSchemas";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
   const session = await getServerSession();
   if (!session)
      return NextResponse.json(
         { error: "User is not authenticated" },
         { status: 401 }
      );
   const body = await request.json();
   const validation = createIssueSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const res = await prisma.issue.create({ data: body });

   return NextResponse.json(res, { status: 201 });
}

export async function GET() {
   const res = await prisma.issue.findMany();
   return NextResponse.json(res);
}
