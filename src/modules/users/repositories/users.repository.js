const User = require('../../../models/User');

exports.findByEmail = (email) => User.findOne({ email });

exports.create = (data) => new User(data).save();

exports.findById = (id) => User.findById(id);

exports.findByIdAndDelete = (id) => User.findByIdAndDelete(id);

exports.updateResetToken = (email, resetToken, resetTokenExpires) =>
  User.updateOne(
    { email },
    { resetPasswordToken: resetToken, resetPasswordExpires: resetTokenExpires }
  );

exports.findByResetToken = (token) =>
  User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

exports.updatePassword = (userId, hashedPassword) =>
  User.updateOne(
    { _id: userId },
    { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined }
  );

exports.save = (userDoc) => userDoc.save();