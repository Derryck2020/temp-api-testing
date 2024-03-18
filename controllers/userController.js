const User = require('../models/User');
const customError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const {
	createTokenUser,
	attachCookiesToReponse,
	checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: 'user' }).select('-password');
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select('-password');
	if (!user) {
		throw new customError.NotFoundError(`No user with id: ${req.params.id}`);
	}
	checkPermissions(req.user, user._id);
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

// Update user with user.save()
const updateUser = async (req, res) => {
	const { email, name } = req.body;
	if (!email || !name) {
		throw new customError.BadRequestError('Please provide all values');
	}
	const user = await User.findOne({ _id: req.user.userId });

	user.email = email;
	user.name = name;

	await user.save();

	const tokenUser = createTokenUser(user);
	attachCookiesToReponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new customError.BadRequestError('Please provide both');
	}
	const user = await User.findOne({ _id: req.user.userId });

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new customError.UnauthenticatedError('Invalid Credentials');
	}
	user.password = newPassword;

	await user.save();
	res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' });
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};

// const updateUser = async (req, res) => {
// 	const { email, name } = req.body;
// 	if (!email || !name) {
// 		throw new customError.BadRequestError('Please provide all values');
// 	}
// 	const user = await User.findOneAndUpdate(
// 		{ _id: req.user.userId },
// 		{ email, name },
// 		{ new: true, runValidators: true }
// 	);
// 	const tokenUser = createTokenUser(user);
// 	attachCookiesToReponse({ res, user: tokenUser });
// 	res.status(StatusCodes.OK).json({ user: tokenUser });
// };
