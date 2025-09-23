import { createZodDto } from "nestjs-zod";
import z from "zod";

export const ResultError = z.object({
  resultCode: z.number().optional(),
  message: z.string().meta({ example: "Operation failed." }),
});
export type ResultError = z.infer<typeof ResultError>;

export class ResultErrorDto extends createZodDto(ResultError) {}
