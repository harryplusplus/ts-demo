import {
  DefaultNamingStrategy,
  NamingStrategyInterface,
  Table,
  View,
} from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils.js";

export class NamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  override tableName(
    targetName: string,
    userSpecifiedName: string | undefined
  ) {
    return userSpecifiedName || snakeCase(targetName);
  }

  override columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ) {
    return `${snakeCase(embeddedPrefixes.concat("").join("_"))}${
      customName || snakeCase(propertyName)
    }`;
  }

  override relationName(propertyName: string) {
    return snakeCase(propertyName);
  }

  override primaryKeyName(
    tableOrName: Table | string,
    columnNames: string[]
  ): string {
    return `pk_${
      typeof tableOrName === "string" ? tableOrName : tableOrName.name
    }_${columnNames.join("_")}`;
  }

  override uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[]
  ): string {
    return `uq_${
      typeof tableOrName === "string" ? tableOrName : tableOrName.name
    }_${columnNames.join("_")}`;
  }

  override foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[]
  ): string {
    return `fk_${
      typeof tableOrName === "string" ? tableOrName : tableOrName.name
    }_${columnNames.join(
      "_"
    )}_${referencedTablePath}_${referencedColumnNames?.join("_")}`;
  }

  override indexName(
    tableOrName: Table | View | string,
    columns: string[],
    where?: string
  ): string {
    return `idx_${
      typeof tableOrName === "string" ? tableOrName : tableOrName.name
    }_${columns.join("_")}${where ? `_${snakeCase(where)}` : ""}`;
  }

  override joinColumnName(relationName: string, referencedColumnName: string) {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  override joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
    secondPropertyName: string
  ) {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replace(
        /\./g,
        "_"
      )}_${secondTableName}_${secondPropertyName.replace(/\./g, "_")}`
    );
  }

  override joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ) {
    return snakeCase(`${tableName}_${columnName || propertyName}`);
  }
}
