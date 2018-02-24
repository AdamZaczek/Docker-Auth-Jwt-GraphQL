/* @flow */

import { Router } from 'express';
import {
  createUser,
  comparePass,
  getUser,
  loginRequired,
} from '../helpers/auth';
import { encodeToken, ensureAuthenticated } from '../helpers/jwtHelpers';
import { handleResponse } from '../helpers/handleResponse';

const router = new Router();

router.post('/register', async (req, res) => {
  const user = await createUser(req);
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

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUser(username);
    // this will throw error if pass does not match
    comparePass(password, user.password_hash);
    const token = await encodeToken(user);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    // rename to some reasonable error
    handleResponse(res, 500, 'error');
  }
});

router.get('/logout', loginRequired, (req, res) => {
  req.session.destroy();
  handleResponse(res, 200, 'success');
});

// this will be moved to a graphql fragment
router.get('/user', [ensureAuthenticated], (req, res) => {
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
