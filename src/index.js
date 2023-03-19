import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import fs from 'fs/promises';

//DUMMY DATA
const users = [
  {
    id: 1,
    name: 'Felipe',
    email: 'felipe@test.com',
    age: 32,
  },
  { id: 2, name: 'Sarah', email: 'sarah@test.com' },
  { id: 3, name: 'Mike', email: 'mike@test.com' },
];

const posts = [
  {
    id: 20,
    authorId: 3,
    title: 'Holidays',
    body: 'I like to relax a bit',
    published: true,
  },
  {
    id: 21,
    authorId: 2,
    title: 'Christmas',
    body: 'Christmas is very pretty',
    published: true,
  },
  {
    id: 22,
    authorId: 1,
    title: 'Sports',
    body: 'Sports are fun to play',
    published: false,
  },
];

const comments = [
  { id: 101, text: 'First comment', authorId: 3, postId: 20 },
  { id: 102, text: 'Second comment', authorId: 1, postId: 22 },
  { id: 103, text: 'Third comment', authorId: 3, postId: 22 },
  { id: 104, text: 'Fourth comment', authorId: 2, postId: 21 },
];

const typeDefs = `
  type Query {
    me: User!
    post(id: ID!): Post!
    users(query: String): [User!]!
    posts(filter: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User! 
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    author: User!
    title: String!
    body: String!
    published: Boolean!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    users: (root, { query }) => {
      if (!query) return users;

      return users.filter((user) => {
        if (user.name.toLowerCase().includes(query)) return user;
      });
    },
    posts: (root, { filter }) => {
      if (!filter) return posts;

      if (filter === `published`) return posts.filter((post) => post.published);
    },
    me() {
      return {
        id: 1,
        name: `Felipe`,
        email: `felipe@test.com`,
      };
    },
    post(root, { id }) {
      return posts.find((post) => post.id === +id);
    },
    comments: () => comments,
  },
  Mutation: {
    createUser: (parent, { name, email, age }, ctx, info) => {
      const emailTaken = users.some((user) => user.email === email);

      if (emailTaken) {
        throw new Error(`Email taken`);
      }

      const user = {
        id: uuidv4(),
        name,
        email,
        age: age || null,
      };
      users.push(user);
      return user;
    },
    createPost: (parent, { title, body, published, author }, ctx, info) => {
      const userExists = users.some((user) => user.id === +author);

      if (!userExists) {
        throw new Error(`User not found`);
      }

      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        authorId: +author,
      };

      posts.push(post);
      return post;
    },
    createComment: (parent, { text, author, post }) => {
      const validAuthor = users.some((user) => user.id === +author);
      const validPost = posts.some((p) => p.id === +post);

      if (!validAuthor || !validPost) {
        throw new Error(`Author or post is invalid`);
      }

      const newComment = {
        id: uuidv4(),
        text,
        authorId: +author,
        postId: +post,
      };
      comments.push(newComment);
      return newComment;
    },
  },
  Post: {
    author: ({ authorId }) => users.find((user) => user.id === authorId),
    comments: ({ id }) => comments.filter((comment) => comment.postId === id),
  },
  User: {
    posts: ({ id }) => posts.filter((post) => post.authorId === id),
    comments: ({ id }) => {
      return comments.filter((comment) => comment.authorId === id);
    },
  },
  Comment: {
    author: ({ authorId }) => {
      return users.find((user) => user.id === authorId);
    },
    post: ({ postId }) => {
      return posts.find((post) => post.id === postId);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
  console.log(`The server is up on http://localhost:${port}/`);
});
