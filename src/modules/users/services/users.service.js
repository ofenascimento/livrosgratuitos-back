const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../utils/sendEmail');
const generateToken = require('../../../utils/generateToken');
const usersRepository = require('../repositories/users.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');
const AppError = require('../../../utils/AppError');

exports.register = async (body) => {
  const emailExist = await usersRepository.findByEmail(body.email);
  if (emailExist) throw new AppError('E-mail já cadastrado', 400);

  const savedUser = await usersRepository.create({
    email: body.email,
    password: body.password,
    name: body.name,
  });

  const firstname = savedUser.name ? savedUser.name.split(' ')[0] : undefined;
  const token = jwt.sign(
    { _id: savedUser._id, name: firstname },
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return token;
};

exports.login = async (body) => {
  const user = await usersRepository.findByEmail(body.email);
  if (!user) throw new AppError('Email não encontrado', 400);

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) throw new AppError('Senha inválida', 400);

  const firstname = user.name ? user.name.split(' ')[0] : undefined;
  const token = jwt.sign(
    { _id: user._id, name: firstname, isAdmin: user.isAdmin },
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return token;
};

exports.deleteUser = async (userId) => {
  const user = await usersRepository.findByIdAndDelete(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');
};

exports.recoverPassword = async (email) => {
  const user = await usersRepository.findByEmail(email);
  if (!user) throw new NotFoundError('Email não encontrado');

  const resetToken = generateToken(6);
  const resetTokenExpires = Date.now() + 600000;

  await usersRepository.updateResetToken(email, resetToken, resetTokenExpires);
  await sendEmail(user.email, 'Recuperação de Senha', resetToken);
};

exports.resetPassword = async (token, password) => {
  const user = await usersRepository.findByResetToken(token);
  if (!user) throw new AppError('Token de redefinição de senha é inválido ou expirou.', 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  await usersRepository.updatePassword(user._id, hashedPassword);
};

exports.getUser = async (userId) => {
  const user = await usersRepository.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return { name: user.name, email: user.email };
};

exports.updateUser = async (userId, body) => {
  const user = await usersRepository.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  user.name = body.name;
  user.email = body.email;

  await usersRepository.save(user);
};