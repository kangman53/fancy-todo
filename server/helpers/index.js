require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 4;
const secret = process.env.JWT_SECRET;

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  checkPassword: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
  jwtSign: (data) => {
    let token = jwt.sign(data, secret);
    return token;
  },
  jwtVerify: (token) => {
    try {
      let data = jwt.verify(token, secret);
      return data;
    } catch (error) {
      throw error;
    }
  }
}