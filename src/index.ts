import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import http from "http";
import cors from "cors";
import parser from "body-parser";
import resolvers from "./resolvers/index.js";
import typeDefs from "./schema/index.js";
import config from "./config.js";

const { PORT } = config;

interface MyContext {
  token?: String;
}

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<MyContext>({
  schema,
  status400ForVariableCoercionErrors: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  parser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: PORT }, resolve)
);
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
