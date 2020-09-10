import { EntityMetadata } from "../typings/EntityMetadata.js";
import { EntityDecoratorOptions } from "../typings/EntityDecoratorOptions.js";
import { ReflectMetadata } from "../private/reflect-as-any.js";
import {
  entityMetadataKey,
  entityMetadataPropertyKey,
} from "../private/symbols.js";

export function Entity(options?: EntityDecoratorOptions) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const entityMetadata: EntityMetadata = ReflectMetadata.getMetadata(
      entityMetadataKey,
      constructor.prototype,
      entityMetadataPropertyKey
    );

    console.log("Now");

    console.log(entityMetadata);

    // return class extends constructor {
    //   [EntitySymbol]: EntityMetadata = { idProperty: "" };
    // };
  };
}
