const UserSchema = require('../models/user.model');

module.exports.read = (id) => {
  return UserSchema.findById(id);
};

module.exports.readByEmail = (email) => {
  return UserSchema.findOne({ email });
};

module.exports.create = (data) => {
  return UserSchema.create(data);
};
