import { DeepPartial, ObjectLiteral, Repository } from "typeorm";

export type Entity = ObjectLiteral;
export type EntityLike<T extends Entity> = DeepPartial<T>;

export type Required = {
  __required?: true;
};

export type RequiredOnly<T extends Entity> = {
  [K in keyof T as T[K] extends Required ? K : never]: T[K] extends infer U &
    Required
    ? U
    : never;
};

export type RequiredIncludes<T extends Entity> = EntityLike<T> &
  RequiredOnly<T>;

async function insertStrict<T extends Entity>(
  repository: Repository<T>,
  entityOrEntityLikes
) {}

async function createManyInternal<T extends Entity>(
  repository: Repository<T>,
  entityLikes: EntityLike<T>[]
): Promise<T[]> {
  const entities = entityLikes.map((x) => repository.create(x));
  const res = await repository.insert(entities);
  if (entities.length !== res.generatedMaps.length) {
    throw new Error(
      `Entity creation failed. entities.length(${entities.length}) != generatedMaps.length(${res.generatedMaps.length})`
    );
  }
  return entities.map((x, i) =>
    repository.merge(x, (res.generatedMaps[i] ?? {}) as DeepPartial<T>)
  );
}

async function createOneInternal<T extends Entity>(
  repository: Repository<T>,
  entityLike: EntityLike<T>
) {
  const entities = await createManyInternal(repository, [entityLike]);
  const entity = entities[0];
  if (!entity) {
    throw new Error("Entity must exists.");
  }
  return entity;
}

export async function createManyFromRequiredIncludes<T extends Entity>(
  repository: Repository<T>,
  entityLikes: RequiredIncludes<T>[]
) {
  return await createManyInternal(repository, entityLikes);
}

export async function createOneFromRequiredIncludes<T extends Entity>(
  repository: Repository<T>,
  entityLike: RequiredIncludes<T>
) {
  return await createOneInternal(repository, entityLike);
}

export async function createManyFromRequiredOnly<T extends Entity>(
  repository: Repository<T>,
  entityLikes: RequiredOnly<T>[]
) {
  return await createManyInternal(repository, entityLikes as EntityLike<T>[]);
}

export async function createOneFromRequiredOnly<T extends Entity>(
  repository: Repository<T>,
  entityLike: RequiredOnly<T>
): Promise<T> {
  return await createOneInternal(repository, entityLike as EntityLike<T>);
}
