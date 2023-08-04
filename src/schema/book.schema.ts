export default `#graphql
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String!
    author: String!
    isbn: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  extend type Query {
    books: [Book]
  }
  extend type Mutation {
    addBook(input: BookInput!): Book!
  }
  extend type Subscription {
    bookAdded: Book
  }
  input BookInput {
    title: String!
    author: String!
    isbn: String
  }
`;
