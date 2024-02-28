import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByPhoneNumber = async (phoneNumber: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { phoneNumber }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};