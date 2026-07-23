const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../utils/sendEmail');
const generateToken = require('../../../utils/generateToken');
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require('../../../utils/errors/NotFoundError');
const AppError = require('../../../utils/AppError');

exports.register = catchAsync(async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) throw new AppError('E-mail já cadastrado', 400);

  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });
  const savedUser = await newUser.save();

  const firstname = savedUser.name ? savedUser.name.split(' ')[0] : undefined;

  const token = jwt.sign({ _id: savedUser._id, name: firstname }, process.env.TOKEN_SECRET);

  res.status(201).header('Authorization', `Bearer ${token}`).json({ token });
});

exports.login = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError('Email não encontrado', 400);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) throw new AppError('Senha inválida', 400);

  const firstname = user.name ? user.name.split(' ')[0] : undefined;

  const token = jwt.sign(
    { _id: user._id, name: firstname, isAdmin: user.isAdmin },
    process.env.TOKEN_SECRET
  );
  res.status(201).header('Authorization', `Bearer ${token}`).json({ token });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);

  if (!user) throw new NotFoundError('Usuário não encontrado');

  res.status(200).json({ message: 'Usuário deletado com sucesso' });
});

exports.recovePassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError('Email não encontrado');

  const resetToken = generateToken(6);
  const resetTokenExpires = Date.now() + 600000;

  await User.updateOne(
    { email },
    {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    }
  );

  await sendEmail(user.email, 'Recuperação de Senha', resetToken);

  res.status(200).json({ message: 'Instruções para redefinição de senha foram enviadas por e-mail.' });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Token de redefinição de senha é inválido ou expirou.', 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.updateOne(
    { _id: user._id },
    {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    }
  );

  res.status(200).json({ message: 'Sua senha foi redefinida' });
});

exports.getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) throw new NotFoundError('Usuário não encontrado');

  res.status(200).json({ name: user.name, email: user.email });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) throw new NotFoundError('Usuário não encontrado');

  user.name = req.body.name;
  user.email = req.body.email;

  await user.save();
  res.status(200).json({ message: 'Usuário atualizado' });
});