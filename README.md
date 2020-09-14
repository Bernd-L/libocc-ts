# libocc

Notice: _This is a work in progress_

The purpose of this project is to provide a simple library for occasionally connected computing.

It's supposed to be a little framework for event-sourced systems. <!--  and aid in command-query separation (CQS). -->

## Usage

Create a class for every entity type you want to have event-sourced, and decorate it with the `@Entity()` decorator, and put the `@Property()` decorator on every field you want to persist.

Then, create a `Repository` for every such entity and use its `create`, `update` and `delete` methods to interact with the data, and use the various find methods to get a projection at a specified time.

Alternative to using repositories, a user of libocc may instead opt to use the `Projector` class (which is used internally by the `Repository` class) directly, if a more low-level approach is desired.

## Example: A book store

Let's assume we want to keep an event-sourced record of the inventory of a book store.

For now, we'll only persist the books themselves (it is planned to eventually support relational entities as well):

`Book.ts`:

```TypeScript
// Another entity
import { Person } from "./Person.js";

// The decorators from libocc
import { Entity } from "../../lib/decorators/Entity.js";
import { Property } from "../../lib/decorators/Property.js";

// The class is decorated with the `@Entity` decorator
@Entity()
export class Book {

  // The `uuid` field has the `idId` flag set, marking it as the ID property
  @Property({ isId: true })
  uuid: string = "some-uuid";

  // This number should be persisted
  @Property()
  someNumber: number = 1234;

  // This number is the result of a function, but it can still be preserved
  @Property()
  actualFunction: number = (() => (() => 234)())();

  // Relational data capabilities are subject to inclusion in a future version of libocc
  @Property()
  author: Person = new Person();

  // Does not have `@Property()`, so it should not be included
  hiddenProperty: string = "sneaky af";

  // The constructor does not need any decorators or parameters on it
  constructor() {}
}
```

`main.ts`:

```TypeScript
// A utility class from libocc
import { Repository } from "../lib/core/Repository.js";

// An entity from the example
import { Book } from "./classes/Book.js";

/**
 * A demo application managing the inventory of a book store
 */
export function runDemo() {
  // Create a new book
  const myBook = new Book();

  // Create a new projector of type `Book`
  const books = new Repository(Book);

  console.log("Empty repository:");
  console.log(books.findAll());

  const oldDate = new Date();

  // Add a new book
  books.create(myBook);

  console.log("Repository after creating new book:");
  console.log(books.findAll());

  // Simulated delay
  for (let i = 0; i < 100000000; i++) {}

  // Modify the book
  books.update({
    uuid: myBook.uuid,
    someNumber: 42,
  });

  console.log("Repository after updating the book:");
  console.log(books.findAll());

  console.log("Repository before the book was updated:");
  console.log(books.findAll(oldDate));
}
```

## Future plans

- Merge features
- Relational entities
- Better persistance
- Better loading
