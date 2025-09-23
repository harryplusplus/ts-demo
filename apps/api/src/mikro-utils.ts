import { EntityClass, Primary, ref, Ref, Reference } from "@mikro-orm/core";

export type ReferenceSource<T> = T | Ref<T> | Primary<T>;

export function createReference<T extends object>(
  entityType: EntityClass<T>,
  source: ReferenceSource<T>
): Ref<T> {
  if (source instanceof entityType) {
    return ref(source);
  } else if (source instanceof Reference) {
    return source as Ref<T>;
  } else {
    const pk = source as Primary<T>;
    return Reference.createFromPK<T>(entityType, pk);
  }
}
