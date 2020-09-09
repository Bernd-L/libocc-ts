import { Book } from "./classes/Book.js";
import { Projector } from "../lib/core/Projector.js";

/**
 * A demo application managing the inventory of a book store
 */
export function runDemo() {
  console.log("Before declare");
  const demo = new Book();
  console.log("After declare");

  const bookProjector = new Projector<Book>([]);
}
