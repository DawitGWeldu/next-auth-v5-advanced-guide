import { db } from "@/lib/db";

export const getUserByPhoneNumber = async (phoneNumber: string) => {
  let usr = null;
    try {
      const user = await db.user.findUnique({ where: { phoneNumber } });
      usr = {
        id: user!.id,
        name: user!.name,
        phoneNumber: user!.phoneNumber,
        phoneNumberVerified: user!.phoneNumberVerified,
        password: user!.password,
        role: user!.role,
        isTwoFactorEnabled: user!.isTwoFactorEnabled,
      };
    } catch (error) {
      console.log(error)
    }


    return usr;
  
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
