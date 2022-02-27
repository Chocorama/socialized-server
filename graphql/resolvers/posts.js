const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, { postId }, context, info) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (parent, { body }, context, info) => {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
        user: user.id,
      });

      const post = await newPost.save();

      return post;
    },
    deletePost: async (parent, { postId }, context, info) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);

        // make sure its the users post
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (parent, { postId }, context, info) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      const found = post.likes.find((p) => p.username === username);

      if (post && found) {
        // already have a like, remove it
        post.likes = post.likes.filter((p) => p.username !== username);
      } else {
        // add a like to array
        post.likes = [
          ...post.likes,
          {
            username,
            createdAt: new Date().toISOString(),
          },
        ];
      }
      await post.save();
      return post;
    },
  },
};
