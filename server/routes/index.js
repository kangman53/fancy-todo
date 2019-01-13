var express = require('express');
var router = express.Router();

const todoRouter = require('./todo');
const { UserController } = require('../controllers')
const { isLogin } = require('../middlewares')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(400).json({
    message: 'Error End Point',
    error: 'Read documentations to use end points'
  })
});

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/login/google', UserController.google);
router.post('/login/token', UserController.checkToken);

router.use(isLogin);
router.use('/todo', todoRouter);

module.exports = router;