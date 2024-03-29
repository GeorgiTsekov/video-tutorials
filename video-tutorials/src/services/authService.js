const jwt = require('../utils/jwt');
const User = require('../models/User');
const { JWT_SECRET } = require('../constants');

exports.login = async ({ username, password }) => {
    let user = await User.findOne({ username });

    if (!user) {
        throw new Error('invalid username or password!');
    }

    let isValid = await user.validatePassword(password);

    if (!isValid) {
        throw new Error('invalid username or password!');
    }

    let payload = {
        _id: user._id,
        username: user.username,
    }

    let token = jwt.sign(payload, JWT_SECRET);

    return token;
}

exports.register = (userData) => User.create(userData);