import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const validate =
  (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const formattedErrors = error.errors.map((err: any) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      next(
        createHttpError(422, {
          message: "Validation failed",
          errors: formattedErrors,
        })
      );
    }
  };
