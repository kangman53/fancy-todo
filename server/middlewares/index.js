const { jwtVerify } = require('../helpers');
const { User } = require('../models')

module.exports = {
  isLogin : async (req, res, next) => {
    try {
      let token = req.headers.token;
      
      if (token) {
          let data = jwtVerify(token);
          let user = await User.findOne({
            email: data.email
          });
          if (user) {
            req.user = user._id;
            next();
          } else {
            res.status(400).json({
              message: 'Login Failed',
              error: 'Wrong Username / Password'
            });
          }
      } else {
        res.status(400).json({
          message: 'Invalid Token',
          error: 'Enter a valid token'
        })
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      })
    }
  }
}