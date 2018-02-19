import moment from 'moment';
import jwt from 'jsonwebtoken';

import { handleResponse } from './handleResponse';
import db from '../db';

export const encodeToken = ({ id }) =>
  jwt.sign(
    {
      exp: moment()
        .add(90, 'days')
        .unix(),
      id,
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

// eslint-disable-next-line consistent-return
export const ensureAuthenticated = (req, res, next) => {
  const { headers } = req;
  const authorizatonHeader = headers.authorization;
  if (!(headers && authorizatonHeader)) {
    return handleResponse(res, 400, 'Please log in');
  }
  // decode the token, this is gonna give us ['beader', 'token']
  const header = authorizatonHeader.split(' ');
  const token = header[1];
  decodeToken(token, (err, payload) => {
    if (err) {
      return handleResponse(res, 401, 'Token has expired');
    }
    return db('users')
      .where({
        id: payload.id,
      })
      .first()
      .then(() => {
        next();
      })
      .catch(() => {
        handleResponse(res, 500, 'Something went wrong during authentication');
      });
  });
};
