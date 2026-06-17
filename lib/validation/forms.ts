import { z } from "zod";

const url = z.string().trim().url().optional().or(z.literal(""));
const requiredText = z.string().trim().min(2, "This field is required.");

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const projectSubmissionSchema = z.object({
  name: requiredText,
  shortDescription: z.string().trim().min(20).max(220),
  category: requiredText,
  ownerName: requiredText,
  websiteUrl: url,
  githubUrl: url,
  discordUrl: url,
  fullDescription: z.string().trim().min(80)
});

export const developerSubmissionSchema = z.object({
  displayName: requiredText,
  roleTitle: requiredText,
  bio: z.string().trim().min(60),
  skills: requiredText,
  availability: requiredText,
  github: url,
  website: url,
  discordUsername: z.string().trim().optional()
});

export const contactSchema = z.object({
  name: requiredText,
  email: z.string().email(),
  topic: requiredText,
  message: z.string().trim().min(20)
});

export const reportSchema = z.object({
  type: requiredText,
  relatedUrl: url,
  name: z.string().trim().optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().trim().min(30),
  urgency: requiredText,
  consentToContact: z.coerce.boolean().default(false),
  anonymous: z.coerce.boolean().default(false)
});

export const legalUpdateSchema = z.object({
  id: requiredText,
  title: requiredText,
  version: requiredText,
  content: z.string().trim().min(80),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
});
