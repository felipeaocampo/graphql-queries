import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser: (parent, { data }, { db }, info) => {
    const emailTaken = db.users.some((user) => user.email === data.email);

    if (emailTaken) {
      throw new Error(`Email taken`);
    }

    const user = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      age: data.age || null,
    };
    db.users.push(user);
    return user;
  },
  updateUser: (parent, { id, data }, { db }) => {
    const user = db.users.find((user) => user.id === +id);

    if (!user) {
      throw new Error(`User to update not found`);
    }

    if (typeof data.email === `string`) {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error(`Email already taken`);
      }

      user.email = data.email;
    }

    if (typeof data.name === `string`) {
      user.name = data.name;
    }

    if (typeof data.age !== `undefined`) {
      user.age = data.age;
    }

    return user;
  },
  deleteUser: (parent, { id }, { db }) => {
    const foundUserIndex = db.users.findIndex((user) => String(user.id) === id);

    if (foundUserIndex < 0) {
      throw new Error(`User does not exist`);
    }

    const deletedUser = db.users.splice(foundUserIndex, 1)[0];

    db.posts = db.posts.filter((post) => {
      if (post.authorId === +id) {
        db.comments = db.comments.filter(
          (comment) => comment.postId !== post.id
        );
        return false;
      }
      return true;
    });
    db.comments = db.comments.filter((comment) => comment.authorId !== +id);

    return deletedUser;
  },
  createPost: (parent, { data }, { db }, info) => {
    const userExists = db.users.some((user) => user.id === +data.author);

    if (!userExists) {
      throw new Error(`User not found`);
    }

    const post = {
      id: uuidv4(),
      title: data.title,
      body: data.body,
      published: data.published,
      authorId: +data.author,
    };

    db.posts.push(post);
    return post;
  },
  deletePost: (parent, { id }, { db }) => {
    const postIndex = db.posts.findIndex((post) => post.id === +id);

    if (postIndex < 0) {
      throw new Error(`Post already does not exist`);
    }

    const deletedPost = db.posts.splice(postIndex, 1)[0];

    db.comments = db.comments.filter((comment) => comment.postId !== +id);

    return deletedPost;
  },
  createComment: (parent, { data }, { db }) => {
    const validAuthor = db.users.some((user) => user.id === +data.author);
    const validPost = db.posts.some((p) => p.id === +data.post);

    if (!validAuthor || !validPost) {
      throw new Error(`Author or post is invalid`);
    }

    const newComment = {
      id: uuidv4(),
      text: data.text,
      authorId: +data.author,
      postId: +data.post,
    };
    db.comments.push(newComment);
    return newComment;
  },
  deleteComment: (parent, { id }, { db }) => {
    const commentIndex = db.comments.findIndex((comment) => comment.id === +id);

    if (commentIndex < 0) {
      throw new Error(`Queried comment does not exists`);
    }

    return db.comments.splice(commentIndex, 1)[0];
  },
};

export default Mutation;
