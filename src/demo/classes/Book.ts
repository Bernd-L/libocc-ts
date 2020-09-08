import { Person } from "./Person.js";
import { Entity } from "../../lib/decorators/Entity.js";

@Entity()
export class Book {
  // @Property()
  author: Person = new Person();
}
