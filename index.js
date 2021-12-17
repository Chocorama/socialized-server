const { ApolloServer } = require('apollo-server');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: ID!
    username: String!
  }

  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => 'hello world',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen({ port: 5000 })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });

// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
// blahhhhhhhhhhhhhhhhhhh
