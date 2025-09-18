import { BadRequestException, PipeTransform } from "@nestjs/common";
import { z, ZodError, ZodType } from "zod";

export class ZodPipe implements PipeTransform {
  constructor(private readonly type: ZodType) {}

  transform(value: unknown) {
    try {
      return this.type.parse(value);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed.",
          ...z.treeifyError(e),
        });
      }

      throw e;
    }
  }
}
