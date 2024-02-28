"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByPhoneNumber } from "@/data/user";
import { sendPasswordResetSms } from "@/lib/sms";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid phone number!" };
  }

  const { phoneNumber } = validatedFields.data;

  const existingUser = await getUserByPhoneNumber(phoneNumber);

  if (!existingUser) {
    return { error: "Phone number not found!" };
  }

  await sendPasswordResetSms(
    phoneNumber
  );

  return { success: "Reset message sent!" };
}