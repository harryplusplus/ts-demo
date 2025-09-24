import {
  DataSource,
  DeepPartial,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";

export class BaseRepository<
  Entity extends ObjectLiteral,
  CreateEntityInput extends DeepPartial<Entity>
> extends Repository<Entity> {
  constructor(target: EntityTarget<Entity>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }

  async createEntity(input: CreateEntityInput) {
    const entities = await this.createEntities([input]);
    const entity = entities[0];
    if (!entity) {
      throw new Error("Entity must exists.");
    }
    return entity;
  }

  async createEntities(inputs: CreateEntityInput[]) {
    const entities = inputs.map((x) => this.create(x));
    const res = await this.insert(entities);
    if (entities.length !== res.generatedMaps.length) {
      throw new Error(
        `Entity creation failed. entities.length(${entities.length}) != generatedMaps.length(${res.generatedMaps.length})`
      );
    }
    return entities.map((x, i) =>
      this.merge(x, (res.generatedMaps[i] ?? {}) as DeepPartial<Entity>)
    );
  }
}
