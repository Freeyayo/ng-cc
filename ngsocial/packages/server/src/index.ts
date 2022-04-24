import express, { Application } from "express";
import { ApolloServer, Config, gql } from "apollo-server-express";
import { IResolvers } from "@graphql-tools/utils";

const typeDefs = gql`
  type Query {
    message: String!
  }
`;

const resolvers: IResolvers = {
  Query: {
    massage: () => "It works",
  },
};

const config: Config = {
  typeDefs,
  resolvers,
};

async function startApolloServer(config: Config) {
  const PORT = 8080;
  const app: Application = express();

  const server: ApolloServer = new ApolloServer(config);
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphQL",
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startApolloServer(config);

// const PORT = 8080;
// const app: Application = express();

// app.get("/", (req, res) => {
//   res.send("Express is serving by ts-node-dev");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
