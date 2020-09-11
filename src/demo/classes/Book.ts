import { Person } from "./Person.js";
import { Entity } from "../../lib/decorators/Entity.js";
import { Property } from "../../lib/decorators/Property.js";

@Entity()
export class Book {
  @Property({ isId: true })
  uuid: string = "some-uuid";

  @Property()
  someNumber: number = 1234;

  @Property()
  actualFunction: number = (() => (() => 234)())();

  @Property()
  author: Person = new Person();

  // Does not have @Property(), so it should not be included
  hiddenProperty: string = "sneaky af";

  constructor() {}
}
