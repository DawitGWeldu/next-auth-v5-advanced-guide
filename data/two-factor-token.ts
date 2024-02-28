import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByPhoneNumber = async (phoneNumber: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { phoneNumber }
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
