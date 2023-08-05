import {
  ResolversParentTypes,
  type MutationAddBookArgs,
} from "../../resolvers-types.js";
import pubsub from "../pubsub.js";
import { withFilter } from "graphql-subscriptions";
import redisClient from "../redis.js";
import { Context } from "../utils.js";

export default {
  Query: {
    books: async (parent: ResolversParentTypes, {}, { models }: Context) =>
      await models.Book.find(),
  },
  Mutation: {
    addBook: async (
      parent: ResolversParentTypes,
      { input }: MutationAddBookArgs,
      { pubsub, models }: Context
    ) => {
      const book = await models.Book.create({ ...input });
      await redisClient.hset(`books:${book.id}`, input);
      pubsub.publish("BOOK_ADDED", { bookAdded: input });
      return book;
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
