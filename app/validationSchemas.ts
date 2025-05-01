import { Status } from "@prisma/client";
import { z } from "zod";

export const createIssueSchema = z.object({
   title: z.string().min(1, "Title is required.").max(255),
   description: z.string().min(1, "Description is required."),
});

export const patchIssueSchema = z.object({
   title: z.string().min(1, "Title is required.").max(255).optional(),
   description: z
      .string()
      .min(1, "Description is required.")
      .max(65535)
      .optional(),
   assignedToUserId: z
      .string()
      .min(1, "assignedToUserId is required.")
      .max(255)
      .optional()
      .nullable(),
   status: z.enum(Object.values(Status) as [string])?.optional(),
});

const createCommentSchema = z.object({
   comment: z.string().min(1, "Comment cannot be empty"),
   userId: z.string().max(255),
   issueId: z.number().int(),
});
