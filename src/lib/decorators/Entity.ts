import { ReflectMetadata } from "../private/reflect-as-any.js";
import {
  entityMetadataKey,
  entityMetadataPropertyKey,
} from "../private/symbols.js";
import { EntityDecoratorOptions } from "../typings/EntityDecoratorOptions.js";
import { EntityMetadata } from "../typings/EntityMetadata.js";

export function Entity(options?: EntityDecoratorOptions) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const entityMetadata: EntityMetadata = ReflectMetadata.getMetadata(
      entityMetadataKey,
      constructor.prototype,
      entityMetadataPropertyKey
    );

    const count = entityMetadata.properties.reduce(
      (acc, val) => (val.options.isId ? acc + 1 : acc),
      0
    );

    if (count !== 1) {
      throw new Error(
        `Entity "${constructor.name}" has ${count} id properties, but exactly one is required.`
      );
    }

    // return class extends constructor {
    //   [EntitySymbol]: EntityMetadata = { idProperty: "" };
    // };
  };
}
