const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, context, info) => {
      const { username } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Must provide a comment body', {
          errrors: {
            body: 'Comment must not be empty!',
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments = [
          {
            username,
            body,
            createdAt: new Date().toISOString(),
          },
          ...post.comments,
        ];

        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    deleteComment: async (parent, { postId, commentId }, context, info) => {
      const user = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not Found!');
      }
    },
  },
};
