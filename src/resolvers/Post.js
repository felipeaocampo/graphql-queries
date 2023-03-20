const Post = {
  author: ({ authorId }) => db.users.find((user) => user.id === authorId),
  comments: ({ id }) => db.comments.filter((comment) => comment.postId === id),
};

export default Post;
