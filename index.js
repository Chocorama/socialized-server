//dependency imports
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

//relative imports
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      req,
    };
  },
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Mongoose connected');
    return server.listen({
      port: PORT,
    });
  })
  .then((res) => {
    console.log(`Connected on port ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
