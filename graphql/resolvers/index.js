const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
  Post: {
    likeCount: (p) => p.likes.length,
    commentCount: (p) => p.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
