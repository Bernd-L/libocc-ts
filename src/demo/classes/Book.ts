import { Person } from "./Person.js";
import { Entity } from "../../lib/decorators/Entity.js";
import { Entity as Entity2 } from "../../lib/typings/Entity.js";
import { Property } from "../../lib/decorators/Property.js";

@Entity()
export class Book implements Entity2 {
  uuid: string = "some-uuid";

  @Property()
  author: Person = new Person();
}
