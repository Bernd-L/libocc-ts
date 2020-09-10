import { PropertyDecoratorOptions } from "./PropertyDecoratorOptions.js";

export interface EntityMetadata {
  properties: {
    identifier: string | symbol;
    options: PropertyDecoratorOptions;
  }[];
}
