import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError } from "express-validator";
import createHttpError from "http-errors";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: Record<string, string>[] = [];

  errors.array().forEach((err: ValidationError) => {
    if ("path" in err) {
      extractedErrors.push({ [err.path]: err.msg });
    } else if ("param" in err) {
      extractedErrors.push({ [String(err.param)]: err.msg });
    }
  });

  throw createHttpError(422, "Received data is not valid", { details: extractedErrors });
};
