import { Book } from "./classes/Book.js";
import { Projector } from "../lib/core/Projector.js";

/**
 * A demo application managing the inventory of a book store
 */
export function runDemo() {
  const myBook = new Book() as Book;

  const bookProjector = new Projector<Book>([]);
}
