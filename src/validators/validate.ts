import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const result = validationResult(req).formatWith((err) => {
    return {
      field: err.type === "field" ? err.path : "unknown",
      message: err.msg,
    };
  });

  if (result.isEmpty()) {
    next();
    return;
  }

  const seen = new Set<string>();
  const extractedErrors = result.array().filter((err) => {
    if (seen.has(err.field)) return false;
    seen.add(err.field);
    return true;
  });

  res.status(422).json({
    success: false,
    message: "Validation failed",
    errors: extractedErrors,
  });
};
