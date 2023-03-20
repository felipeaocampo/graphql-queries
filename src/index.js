import { GraphQLServer } from 'graphql-yoga';
import path from 'path';

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation.';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schema.graphql'),
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment,
  },
  context: {
    db,
  },
});

server.start(({ port }) => {
  console.log(`The server is up on http://localhost:${port}/`);
});
