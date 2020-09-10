import { ReflectMetadata } from "../private/reflect-as-any.js";
import {
  entityMetadataPropertyKey,
  entityMetadataKey,
} from "../private/symbols.js";
import { EntityMetadata } from "../typings/EntityMetadata.js";

export function Property(): PropertyDecorator {
  return function (target: Object, key: string | symbol) {
    // Load the metadata of the entity to which the property belongs to
    let entityMetadata: EntityMetadata = ReflectMetadata.getOwnMetadata(
      entityMetadataKey,
      target,
      entityMetadataPropertyKey
    ) || {
      idProperty: -1,
      properties: [],
    };

    // Add data about the property to the metadata of the entity the property belongs to
    entityMetadata.properties.push({
      identifier: key,
      type: ReflectMetadata.getMetadata("design:type", target, key),
    });

    // Write the metadata of the entity to which the property belongs to
    ReflectMetadata.defineMetadata(
      entityMetadataKey,
      entityMetadata,
      target,
      entityMetadataPropertyKey
    );

    console.log(entityMetadata);
  };
}
