const UserSchema = require('../models/user.model');

const fieldsOmittedByDefault = '-favorites -collections -__v';

module.exports.read = async (id) => {
  const user = await UserSchema.findById(id);
  return user?._doc;
};

module.exports.readByEmail = async (email) => {
  const user = await UserSchema.findOne({ email }, fieldsOmittedByDefault);
  return user?._doc;
};

module.exports.create = async (data) => {
  const user = await UserSchema.create(data, fieldsOmittedByDefault);
  return user?._doc;
};
