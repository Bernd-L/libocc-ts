import { Repository } from "../lib/core/Repository.js";
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
