import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Something broke",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
