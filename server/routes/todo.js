var express = require('express');
var router = express.Router();
const { TodoController } = require('../controllers');
/* GET users listing. */
router.get('/', TodoController.getAll);
router.post('/', TodoController.create);
router.put('/:id', TodoController.update);
router.delete('/:id', TodoController.delete);

module.exports = router;
