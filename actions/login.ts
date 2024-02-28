"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByPhoneNumber } from "@/data/user";
import { getTwoFactorTokenByPhoneNumber } from "@/data/two-factor-token";
import { 
  sendVerificationSms,
  sendTwoFactorTokenSms,
} from "@/lib/sms";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { 
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";
import { 
  getTwoFactorConfirmationByUserId
} from "@/data/two-factor-confirmation";
import parsePhoneNumber from "libphonenumber-js";
import { debug } from "console";


export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { phoneNumber, password, code } = validatedFields.data;
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  const num = parsedPhoneNumber!.nationalNumber;
  const existingUser = await getUserByPhoneNumber(num);

  if (!existingUser || !existingUser.phoneNumber ) {
    return { error: "Phone number does not exist!" }
  }

  if (!existingUser.phoneNumberVerified) {
    

    sendVerificationSms(
       existingUser.phoneNumber,
    );

    return { success: "Confirmation message sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.phoneNumber) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByPhoneNumber(
        existingUser.phoneNumber
      );

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      });
    } else {
      await sendTwoFactorTokenSms(
        existingUser.phoneNumber,
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      phoneNumber: num,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
};
