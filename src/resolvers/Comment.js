const Comment = {
  author: ({ authorId }) => {
    return db.users.find((user) => user.id === authorId);
  },
  post: ({ postId }) => {
    return db.posts.find((post) => post.id === postId);
  },
};

export default Comment;
