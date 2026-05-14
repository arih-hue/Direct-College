import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export const validateBody =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- `express` body is untyped until per-route generics are wired.
    req.body = parsed.data;
    next();
  };
