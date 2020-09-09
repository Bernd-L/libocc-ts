import { Entity as Entity2 } from "../../lib/typings/Entity.js";

export function Entity(): ClassDecorator {
  return function (target) {
    console.log("Hello from the entity");
  };
}
