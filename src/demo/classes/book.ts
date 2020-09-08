import { Person } from "./person.js";

// @Entity()
export class Book {
  // @Property()
  author: Person = new Person();
}
