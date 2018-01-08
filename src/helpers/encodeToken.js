const moment = require('moment');
const jwt = require('jwt-simple');

export const encodeToken = user => {
  const playload = {
    exp: moment()
      .add(14, 'days')
      .unix(),
    iat: moment().unix(),
    sub: user.id,
  };
  return jwt.encode(playload, process.env.TOKEN_SECRET);
};

module.exports = {
  encodeToken,
};
