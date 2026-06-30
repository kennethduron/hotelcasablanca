"use server";

import { z } from "zod";

import { createContactMessage } from "@/lib/repositories/hotel-repository";

const contactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(5),
});

export async function createContactMessageAction(formData: FormData) {
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