import bookSchema from "./book.schema.js";

const linkSchema = `#graphql
  scalar Date
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, bookSchema];
