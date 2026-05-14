import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export const validateQuery =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
          details: parsed.error.flatten(),
        },
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- express query is untyped
    req.query = parsed.data;
    next();
  };
