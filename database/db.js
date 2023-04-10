// Import the mongoose module
const mongoose = require('mongoose');

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

// Define the database URL to connect to
const CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

// connects to mongodb database
const connectToDB = () => {
  console.log('Connecting to MongoDB');

  mongoose.connect(CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  });
};

mongoose.connection.on('error', (error) => {
  console.log(`MongoDB Error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  connectToDB();
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// connect to mongodb database
connectToDB();

// import database models
require('./models/user.model');
require('./models/favorite.model');
require('./models/collection.model');
