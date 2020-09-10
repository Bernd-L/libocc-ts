import { ReflectMetadata } from "../private/reflect-as-any.js";
import {
  entityMetadataPropertyKey,
  entityMetadataKey,
} from "../private/symbols.js";
import { EntityMetadata } from "../typings/EntityMetadata.js";
import { PropertyDecoratorOptions } from "../typings/PropertyDecoratorOptions.js";

export function Property(
  propertyOptions?: Partial<PropertyDecoratorOptions>
): PropertyDecorator {
  return function (target: Object, key: string | symbol) {
    // Load the metadata of the entity to which the property belongs to
    let entityMetadata: EntityMetadata = ReflectMetadata.getOwnMetadata(
      entityMetadataKey,
      target,
      entityMetadataPropertyKey
    ) || {
      properties: [],
    };

    const options: Required<PropertyDecoratorOptions> = {
      isId: false,
      type: ReflectMetadata.getMetadata("design:type", target, key),
    };

    // Add data about the property to the metadata of the entity the property belongs to
    entityMetadata.properties.push({
      identifier: key,
      options: Object.assign(options, propertyOptions),
    });

    // Write the metadata of the entity to which the property belongs to
    ReflectMetadata.defineMetadata(
      entityMetadataKey,
      entityMetadata,
      target,
      entityMetadataPropertyKey
    );
  };
}
