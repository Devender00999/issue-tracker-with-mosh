import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createIssueSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
   const body = await request.json();
   const validation = createIssueSchema.safeParse(body);
   if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

   const res = await prisma.issue.create({ data: body });

   return NextResponse.json(res, { status: 201 });
}
