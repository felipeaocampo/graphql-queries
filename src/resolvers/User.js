const User = {
  posts: ({ id }) => db.posts.filter((post) => post.authorId === id),
  comments: ({ id }) => {
    return db.comments.filter((comment) => comment.authorId === id);
  },
};

export default User;
