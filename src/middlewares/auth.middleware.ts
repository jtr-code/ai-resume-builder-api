import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();

export const verifyJWT = expressAsyncHandler(
  async (req: Request, _res, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw createHttpError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );

      let userId: string | undefined;
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        userId = (decodedToken as jwt.JwtPayload).id as string;
      }
      console.log("userId: ", userId);

      if (!userId) {
        throw createHttpError(401, "Invalid Access Token");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      console.log("user: ", user);

      if (!user) {
        throw createHttpError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      throw createHttpError(401, error?.message || "Invalid access token");
    }
  }
);
