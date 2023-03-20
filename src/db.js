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

const db = {
  users,
  posts,
  comments,
};

export default db;
