const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

// explained at 2:04, these are called modifiers and each time anything that returns a Post will match check the name of type with this modifier and run through here first

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
