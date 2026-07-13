"use server";

import { z } from "zod";
import { headers } from "next/headers";

import { createContactMessage } from "@/lib/repositories/hotel-repository";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(2000),
});

export async function createContactMessageAction(formData: FormData) {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  enforceRateLimit(`contact:${ip}`);
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return;
  }

  await createContactMessage(parsed.data);

  return;
}