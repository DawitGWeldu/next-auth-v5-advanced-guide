import axios from "axios"
import { encode } from 'urlencode';
import parsePhoneNumber from 'libphonenumber-js'

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenSms = async (
  phoneNumber: string,
) => {
  await axios({
    url: 'https://api.afromessage.com/api/challenge',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${process.env.AFRO_SMS_API_KEY}`
    },
    params: {
      timeout: 10000, // default is `0` (no timeout)
      from: process.env.AFRO_SMS_IDENTIFIER_ID,
      to: phoneNumber,
      pr: "Your%20verification%20code%20is%20", // must be url encoded
      ps: ".%20This%20code%20will%20expire%20in%20one%20hour.%20Thank%20you%20for%20joining.%20%F0%9F%8E%89%20-Dave", // must be url encoded
      ttl: 0,
      len: 6,
      t: 0
    },
  });
};

export const sendPasswordResetSms = async (
  phoneNumber: string,
) => {
  const pre = `Click this link ${domain}/auth/new-password?token=`;
  const pr = encode(pre);
  const ps = encode("to reset your password.");

  await axios({
    url: 'https://api.afromessage.com/api/challenge',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${process.env.AFRO_SMS_API_KEY}`
    },
    params: {
      timeout: 10000, // default is `0` (no timeout)
      from: process.env.AFRO_SMS_IDENTIFIER_ID,
      to: phoneNumber,
      pr: pr, // must be url encoded
      sb: 0,
      sa: 2,
      ps: ps, // must be url encoded
      ttl: 0,
      len: 6,
      t: 0
    },
  });

};

export const sendVerificationSms = async (
  phoneNumber: string,
) => {
  const pr = "Your%20verification%20code%20is%20"; // must be url encoded
  const ps= ".%20This%20code%20will%20expire%20in%20one%20hour.%20Thank%20you%20for%20joining.%20%F0%9F%8E%89%20-Dave"; // must be url encoded
  const verification = await axios({
    url: 'https://api.afromessage.com/api/challenge',
    method: 'get',
    headers: {
      'Authorization': `Bearer ${process.env.AFRO_SMS_API_KEY}`
    },
    params: {
      timeout: 10000, // default is `0` (no timeout)
      from: process.env.AFRO_SMS_IDENTIFIER_ID,
      to: phoneNumber,
      pr: pr, // must be url encoded
      sb: 0,
      sa: 2,
      ps: ps, // must be url encoded
      ttl: 0,
      len: 6,
      t: 0
    },
  });

  const code = verification.data.response.code;
  return code;
};
