/* @flow */

import { Router } from 'express';
import {
  createUser,
  comparePass,
  getUser,
  loginRequired,
} from '../helpers/auth';
import { decodeToken, encodeToken } from '../helpers/jwtHelpers';
import db from '../db';

const router = new Router();

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({
    status: statusMsg,
  });
};

// eslint-disable-next-line consistent-return
const ensureAuthenticated = (req, res, next) => {
  const { headers } = req;
  const authorizatonHeader = headers.authorization;
  if (!(headers && authorizatonHeader)) {
    return res.status(400).json({
      status: 'Please log in',
    });
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
      .catch(error => {
        handleResponse(res, 500, error);
      });
  });
};

router.post('/auth/register', (req, res) => {
  createUser(req).then(user => {
    const token = encodeToken(user[0]);
    if (token) {
      res.status(200).json({
        status: 'success',
        token,
      });
    } else {
      handleResponse(res, 503, 'Something went wrong');
    }
  });
});

router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  getUser(username)
    .then(response => {
      comparePass(password, response.password_hash);
      return response;
    })
    // resonse equals true when trying to log user in
    // that's why encodeToken does not return the id
    .then(response => encodeToken(response))
    .then(token => {
      res.status(200).json({
        status: 'success',
        token,
      });
    })
    .catch(err => {
      handleResponse(res, 500, err);
    });
});

router.get('/auth/logout', loginRequired, (req, res) => {
  req.session.destroy();
  handleResponse(res, 200, 'success');
});

// this will be moved to a graphql fragment
router.get('/auth/user', [ensureAuthenticated], (req, res) => {
  handleResponse(res, 200, 'success');
});

// Allows to fetch the last login error(s) (which is usefull for single-page apps)
router.post('/login/error', (req, res) => {
  res.send({
    errors: req.flash('error'),
  });
});

// Next 3 Routes Are For Testing Authentication
router.get('/', (req, res) => {
  console.log('yay from index page');
  res.render('pages/index', {
    // user: req.user,
  });
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/signup', (req, res) => {
  res.render('pages/signup');
});

export default router;
