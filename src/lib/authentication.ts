import { Request } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config.js";
import { authenticationErrors } from "./errors.js";

const pemCert = `
-----BEGIN PUBLIC KEY-----
${config.AUTH_PUBLIC_KEY}
-----END PUBLIC KEY-----
`;

const removeBearer = (token: string) => token.replace("Bearer ", "");

export default function authenticateToken(req: Request) {
  const token = req.headers.token as string;
  const id_token = req.headers.id_token as string;
  if (!token) {
    throw authenticationErrors("No token provided");
  }

  if (!id_token) {
    throw authenticationErrors("No id_token provided");
  }
  try {
    validateToken(removeBearer(token)) as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw authenticationErrors("Token expired");
    }
    throw authenticationErrors("The provided token could not be verified");
  }
  try {
    const tokenInfo = validateToken(removeBearer(id_token)) as JwtPayload;
    console.log("tokenInfo", tokenInfo.org_roles);
    const { sid, email } = validateToken(removeBearer(id_token)) as JwtPayload;
    return { id: sid, email };
  } catch (err) {
    throw authenticationErrors("Token could not be verified");
  }
}

export const validateToken = (token: string) => {
  return jwt.verify(token, pemCert, { algorithms: ["RS256"] });
};
