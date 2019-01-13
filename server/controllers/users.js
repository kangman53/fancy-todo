const axios = require('axios');
const {OAuth2Client} = require('google-auth-library');

const { User } = require('../models');
const { checkPassword, jwtVerify, jwtSign } = require('../helpers');
const client = new OAuth2Client(process.env.CLIENT_ID);

class UserController {

  static async register(req, res) {
    try {
      let response = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        picture_url: req.body.picture_url
      });

      let token = jwtSign({
        email: response.email
      });
      req.headers.token = token;
      UserController.checkToken(req, res);

    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      });
    }
  }

  static async login(req, res) {
    try {
      let user = await User.findOne({
        email: req.body.email
      });
      if (user) {
        if (checkPassword(req.body.password, user.password)) {
          let token = jwtSign({
            email: user.email
          });

          res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            picture_url: user.picture_url,
            token: token
          });
        } else {
          res.status(400).json({
            message: 'Login Failed',
            error: 'Wrong Username / Password'
          });
        }
      } else {
        res.status(400).json({
          message: 'Login Failed',
          error: 'Wrong Username / Password'
        })
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      });
    }
  }

  static async checkToken(req, res) {
    let token = req.headers.token;
    
    if (token) {
      try {
        let data = jwtVerify(token);
        let user = await User.findOne({
          email: data.email
        });

        if (user) {
          res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            picture_url: user.picture_url,
            token: token
          });
        } else {
          res.status(400).json({
            message: 'Login Failed',
            error: 'Wrong Username / Password'
          });
        }
        
      } catch (error) {
        res.status(500).json({
          message: 'Internal Server Error',
          error: error
        });
      }
    } else {
      res.status(400).json({
        message: 'Invalid Token',
        error: 'Enter a valid token'
      })
    }
  }

  static async google(req, res) {
    if (req.headers.id_token) {
      try {
        let ticket = await client.verifyIdToken({
          idToken: req.headers.id_token,
          audience: process.env.CLIENT_ID 
        })
        let payload = ticket.getPayload();
        let user = await User.findOne({
          email: payload.email
        })
        if (user) {
          let token = jwtSign({
            email: user.email
          });
          req.headers.token = token;
          UserController.checkToken(req, res);
        } else {
          res.status(200).json({
            fullname: payload.name,
            email: payload.email,
            picture_url: payload.picture
        })
          // req.body = {
          //   fullname: payload.name,
          //   email: payload.email,
          //   password: '',
          //   picture_url: payload.picture
          // }
          // UserController.register(req, res)
        }
      } catch (error) {
        res.status(500).json({
          message: 'Internal Server Error',
          error: error
        })
      }
    } else {
      res.status(400).json({
        message: 'Invalid Token',
        error: 'Enter a Valid Token'
      })
    }
  }
}

module.exports = UserController