import { Person } from "./Person.js";

// @Entity()
export class Book {
  // @Property()
  author: Person = new Person();
}
