const Query = {
  users: (root, { query }, { db }) => {
    if (!query) return db.users;

    return db.users.filter((user) => {
      if (user.name.toLowerCase().includes(query)) return user;
    });
  },
  posts: (root, { filter }, { db }) => {
    if (!filter) return db.posts;

    if (filter === `published`)
      return db.posts.filter((post) => post.published);
  },
  me() {
    return {
      id: 1,
      name: `Felipe`,
      email: `felipe@test.com`,
    };
  },
  post(root, { id }, { db }) {
    return db.posts.find((post) => post.id === +id);
  },
  comments: (parent, args, { db }) => {
    return db.comments;
  },
};

export default Query;
