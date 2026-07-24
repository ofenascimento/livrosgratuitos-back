const catchAsync = require('../../../utils/catchAsync');
const usersService = require('../services/users.service');

exports.register = catchAsync(async (req, res) => {
  const token = await usersService.register(req.body);
  res.status(201).header('Authorization', `Bearer ${token}`).json({ token });
});

exports.login = catchAsync(async (req, res) => {
  const token = await usersService.login(req.body);
  res.status(201).header('Authorization', `Bearer ${token}`).json({ token });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await usersService.deleteUser(req.params.userId);
  res.status(200).json({ message: 'Usuário deletado com sucesso' });
});

exports.recovePassword = catchAsync(async (req, res) => {
  await usersService.recoverPassword(req.body.email);
  res.status(200).json({ message: 'Instruções para redefinição de senha foram enviadas por e-mail.' });
});

exports.resetPassword = catchAsync(async (req, res) => {
  await usersService.resetPassword(req.params.token, req.body.password);
  res.status(200).json({ message: 'Sua senha foi redefinida' });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await usersService.getUser(req.params.userId);
  res.status(200).json(user);
});

exports.updateUser = catchAsync(async (req, res) => {
  await usersService.updateUser(req.params.userId, req.body);
  res.status(200).json({ message: 'Usuário atualizado' });
});