import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { getVerificationTokenByPhoneNumber } from "@/data/verificiation-token";
import { getPasswordResetTokenByPhoneNumber } from "@/data/password-reset-token";
import { getTwoFactorTokenByPhoneNumber } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (phoneNumber: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByPhoneNumber(phoneNumber);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      }
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      phoneNumber,
      token,
      expires,
    }
  });

  return twoFactorToken;
}

export const generatePasswordResetToken = async (phoneNumber: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByPhoneNumber(phoneNumber);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      phoneNumber,
      token,
      expires
    }
  });

  return passwordResetToken;
}

export const generateVerificationToken = async (phoneNumber: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByPhoneNumber(phoneNumber);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      phoneNumber,
      token,
      expires,
    }
  });

  return verficationToken;
};
