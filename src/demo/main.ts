import { Book } from "./classes/Book.js";
import { Projector } from "../lib/core/Projector.js";
import { CRUD } from "../lib/typings/CRUD.js";

/**
 * A demo application managing the inventory of a book store
 */
export function runDemo() {
  // Create a new book
  const myBook = new Book();

  // Create a new projector of type `Book`
  const bookProjector = new Projector(Book);

  console.log("Empty:");
  console.log(bookProjector.project());

  const oldDate = new Date();

  // Add a new book
  bookProjector.add({
    date: oldDate,
    operation: CRUD.Create,
    data: myBook,
  });

  console.log("Create:");
  console.log(bookProjector.project());

  // Simulated delay
  const newDate = new Date(10 + oldDate.valueOf());

  bookProjector.add({
    date: newDate,
    operation: CRUD.Update,
    data: {
      uuid: myBook.uuid,
      someNumber: 42,
    },
  });

  console.log("Update:");
  console.log(bookProjector.project());

  console.log("From before:");
  console.log(bookProjector.project(oldDate));
}
