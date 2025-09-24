import {
  createManyFromRequiredIncludes,
  createManyFromRequiredOnly,
  createOneFromRequiredIncludes,
  createOneFromRequiredOnly,
  RequiredIncludes,
  RequiredOnly,
} from "@/types/required";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

export class BaseRepository<
  Entity extends ObjectLiteral
> extends Repository<Entity> {
  constructor(target: EntityTarget<Entity>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }

  async createOneFromRequiredIncludes(entityLike: RequiredIncludes<Entity>) {
    return await createOneFromRequiredIncludes(this, entityLike);
  }

  async createManyFromRequiredIncludes(
    entityLikes: RequiredIncludes<Entity>[]
  ) {
    return await createManyFromRequiredIncludes(this, entityLikes);
  }

  async createOneFromRequiredOnly(entityLike: RequiredOnly<Entity>) {
    return await createOneFromRequiredOnly(this, entityLike);
  }

  async createManyFromRequiredOnly(entityLikes: RequiredOnly<Entity>[]) {
    return await createManyFromRequiredOnly(this, entityLikes);
  }
}
