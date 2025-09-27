import deepmerge from "deepmerge";
import { ObjectLiteral, Repository } from "typeorm";
import z, { ZodType } from "zod";

export class Inserter<
  TEntity extends ObjectLiteral,
  TInsertSchema extends ZodType,
  TInput extends z.input<TInsertSchema> = z.input<TInsertSchema>
> {
  constructor(private readonly insertSchema: TInsertSchema) {}

  async insert(
    repository: Repository<TEntity>,
    input: TInput
  ): Promise<TEntity>;
  async insert(
    repository: Repository<TEntity>,
    input: TInput[]
  ): Promise<TEntity[]>;
  async insert(
    repository: Repository<TEntity>,
    input: TInput | TInput[]
  ): Promise<TEntity | TEntity[]> {
    const inputs = Array.isArray(input) ? input : [input];
    if (inputs.length < 1) {
      throw new Error("There must be at least one input.");
    }
    const rawEntities = inputs.map(
      (x) => this.insertSchema.parse(x) as TEntity
    );
    const res = await repository.insert(rawEntities);
    if (rawEntities.length !== res.generatedMaps.length) {
      throw new Error(
        `Entity insertion failed. rawEntities.length(${rawEntities.length}) != generatedMaps.length(${res.generatedMaps.length})`
      );
    }
    const entities = rawEntities.map((x, i) =>
      deepmerge<TEntity>(x, res.generatedMaps[i] as TEntity)
    );
    if (Array.isArray(input)) {
      return entities;
    } else {
      return entities[0]!;
    }
  }
}
