const { model, Schema } = require('mongoose');

//we could pecify default value for createdAt but well do it on gql side instead

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectID,
    ref: 'User',
  },
});

module.exports = model('Post', postSchema);
