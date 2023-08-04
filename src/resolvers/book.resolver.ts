import {
  ResolversParentTypes,
  type Book,
  type MutationAddBookArgs,
} from "../../resolvers-types.js";
import { pubsub } from "../pubsub.js";
import { withFilter } from "graphql-subscriptions";

const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin 123",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export default {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook: (
      parent: ResolversParentTypes,
      { input }: MutationAddBookArgs
    ): Book => {
      books.push(input);
      pubsub.publish("BOOK_ADDED", { bookAdded: input });
      return input;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("BOOK_ADDED"),
        (payload, variables) => {
          // return payload.bookAdded.author === variables.author;
          return true;
        }
      ),
    },
  },
};
