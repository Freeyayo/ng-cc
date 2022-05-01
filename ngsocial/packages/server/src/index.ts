import express, { Application } from "express";
import cors from "cors";
// import { ApolloServer, Config, gql } from "apollo-server-express";
import schema from "./graphql/schema";
import { ApolloServer } from "apollo-server-express";
import casual from "casual";
import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
// import { IResolvers } from "@graphql-tools/utils";x

const connection: Promise<Connection> = createConnection();

const postsIds: string[] = [];
const usersIds: string[] = [];

const mocks = {
  User: () => ({
    // id: casual.uuid,
    id: () => {
      let uuid = casual.uuid;
      usersIds.push(uuid);
      return uuid;
    },
    fullName: casual.full_name,
    bio: casual.text,
    email: casual.email,
    username: casual.username,
    password: casual.password,
    image: "https://picsum.photos/seed/picsum/200/300",
    coverImage: "https://picsum.photos/seed/picsum/200/300",
    postsCount: () => casual.integer(0),
  }),
  Post: () => ({
    // id: casual.uuid,
    id: () => {
      let uuid = casual.uuid;
      postsIds.push(uuid);
      return uuid;
    },
    author: casual.random_element(usersIds),
    text: casual.text,
    image: "https://picsum.photos/seed/picsum/200/300",
    commentsCount: () => casual.integer(0),
    likesCount: () => casual.integer(0),
    latestLike: casual.first_name,
    createdAt: () => casual.date(),
  }),
  Comment: () => ({
    id: casual.uuid,
    author: casual.random_element(usersIds),
    comment: casual.text,
    post: casual.uuid,
    createdAt: () => casual.date(),
  }),
  Like: () => ({
    id: casual.uuid,
    user: casual.random_element(usersIds),
    // post: casual.uuid,
    post: casual.random_element(postsIds),
  }),
  Query: () => ({
    getPostsByUserId: () => [...new Array(casual.integer(10, 100))],
    getFeed: () => [...new Array(casual.integer(10, 100))],
    getNotificationsByUserId: () => [...new Array(casual.integer(10, 100))],
    getCommentsByPostId: () => [...new Array(casual.integer(10, 100))],
    getLikesByPostId: () => [...new Array(casual.integer(10, 100))],
    searchUsers: () => [...new Array(casual.integer(10, 15))],
  }),
};

// const typeDefs = gql`
//   type Query {
//     message: String!
//   }
// `;

// const resolvers: IResolvers = {
//   Query: {
//     message: () => "It works",
//   },
// };

// const config: Config = {
//   typeDefs,
//   resolvers,
// };

// async function startApolloServer(config: Config) {
async function startApolloServer() {
  const PORT = 8080;
  const app: Application = express();

  app.use(cors());

  //   const server: ApolloServer = new ApolloServer(config);
  const server: ApolloServer = new ApolloServer({ schema });
  //   const server: ApolloServer = new ApolloServer({ schema, mocks: true });
  //   const server: ApolloServer = new ApolloServer({
  //     schema,
  //     mocks,
  //     mockEntireSchema: false,
  //   });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphQL",
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// startApolloServer(config);
// startApolloServer();
connection
  .then(() => {
    startApolloServer();
  })
  .catch((error) => {
    console.log("Database connection error", error);
  });

// const PORT = 8080;
// const app: Application = express();

// app.get("/", (req, res) => {
//   res.send("Express is serving by ts-node-dev");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
