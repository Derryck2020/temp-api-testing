const { createJWT, isTokenValid, attachCookiesToReponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');

module.exports = {
	createJWT,
	isTokenValid,
	attachCookiesToReponse,
	createTokenUser,
	checkPermissions,
};
