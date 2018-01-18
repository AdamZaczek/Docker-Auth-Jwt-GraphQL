/* @flow */

// import URL from 'url';
// import passport from 'passport';
// import validator from 'validator';
import { Router } from 'express';
import { createUser, loginRequired } from '../helpers/auth';
import { encodeToken } from '../helpers/jwtHelpers';

const router = new Router();

const handleResponse = (res, code, statusMsg) => {
  res.status(code).json({
    status: statusMsg,
  });
};

// router.post('/auth/register', (req, res, next) =>
//   createUser(req)
//     .then(user => {
//       console.log(user);
//       passport.authenticate('local', (err, user) => {
//         if (user) {
//           handleResponse(res, 200, 'success');
//         }
//       })(req, res, next);
//     })
//     .catch(err => handleResponse(err, 500, 'error')),
// );

router.post('/auth/register', (req, res) => {
  createUser(req).then(user => {
    // console.log(user);
    const token = encodeToken(user[0]);
    res.status(200).json({
      status: 'success',
      token,
    });
    // return encodeToken(user[0])
    //   .then(token => {
    //     res.status(200).json({
    //       status: 'success',
    //       token,
    //     });
    //   })
    //   .catch(err => {
    //     res.status(500).json({
    //       status: 'error',
    //       err,
    //     });
    //   });
  });
});

// router.post('/auth/register', (req, res) =>
//   createUser(req).then(user => {
//     console.log(user);
//     return encodeToken(user[0])
//       .then(token => {
//         res.status(200).json({
//           status: 'success',
//           token,
//         });
//       })
//       .catch(err => {
//         res.status(500).json({
//           status: 'error',
//           err,
//         });
//       });
//   }),
// );

// passport.authenticate('local', (err, user) => {
//   if (user) {
//     handleResponse(res, 200, 'success');
//   }
// })(req, res, next);
// })
// .catch(err => handleResponse(err, 500, 'error')),

// router.post('/register', (req, res, next) =>
//   authHelpers
//     .createUser(req)
//     .then(user => localAuth.encodeToken(user[0]))
//     .then(token => {
//       res.status(200).json({
//         status: 'success',
//         token: token,
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         status: 'error',
//       });
//     }),
// );

router.post('/auth/login', (req, res, next) => {
  console.log('hey from /auth/login');
  passport.authenticate('local', (err, user) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      const token = encodeToken(user);
      res.json({
        token,
      });
      // req.logIn(user, error => {
      //   if (error) {
      //     handleResponse(res, 500, 'error');
      //   }
      //   handleResponse(res, 200, 'success');
      // });
    }
  })(req, res, next);
});

router.get('/auth/logout', loginRequired, (req, res) => {
  req.session.destroy();
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
