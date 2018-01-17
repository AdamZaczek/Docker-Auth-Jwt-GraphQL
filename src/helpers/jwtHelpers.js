const moment = require('moment');
const jwt = require('jsonwebtoken');

export const encodeToken = user =>
  jwt.sign(
    {
      exp: moment()
        .add(90, 'days')
        .unix(),
      id: user.id,
    },
    process.env.TOKEN_SECRET,
  );

export const decodeToken = (token, callback) => {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
};
