"use server";

import { db } from "@/lib/db";
import { getUserByPhoneNumber } from "@/data/user";
import { getVerificationTokenByPhoneNumber, getVerificationTokenByToken } from "@/data/verificiation-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByPhoneNumber(existingToken.phoneNumber);

  if (!existingUser) {
    return { error: "Phone number does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      phoneNumberVerified: new Date(),
      phoneNumber: existingToken.phoneNumber,
    }
  });

  const existingtoken = await getVerificationTokenByPhoneNumber(existingToken.phoneNumber);


  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Phone number verified!" };
};
