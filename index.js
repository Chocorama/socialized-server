//dependency imports
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

//relative imports
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req,
    };
  },
});

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Mongoose connected');
    return server.listen({
      port: 5000,
    });
  })
  .then((res) => {
    console.log(`Connected on port ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
