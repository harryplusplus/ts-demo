import z from "zod";

export const BigIntString = z.string().regex(/^\d+$/);
