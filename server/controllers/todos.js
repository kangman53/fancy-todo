const { Todo } = require('../models');

class TodoController {

  static async create (req, res) {
    try {
      if (req.user) {
          let response = await Todo.create({
            userId: req.user,
            name: req.body.name,
            description: req.body.description,
            due_date: req.body.due_date
          })
          
          res.status(201).json(response)
        } else {
          res.status(400).json({
            message: 'Error',
            error: 'Not Autorized'
          })
        
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      })
    }
  }

  static async getAll (req, res) {
    try {
      let response = await Todo.find({
        userId: req.user
      })
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      });
    }
  }

  static async update (req, res) {
    try {
      let data = req.body;
      let ignore = ['_id', 'date_created', 'userId']
      for (const key in data) {
        if (!data[key] || ignore.includes(key)) {
          delete data[key];
        }
      }

      let response = await Todo.findOneAndUpdate({
        _id: req.params.id,
        userId: req.user
      }, data, {
        new: true
      })

      if (response) {
        res.status(200).json(response);
      } else {
        res.status(400).json({
          message: 'Error update todo',
          error: 'Todo not found / You are not autorized'
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      });
    }
  }

  static async delete (req, res) {
    try {
      let response = await Todo.findOneAndDelete({
        _id: req.params.id,
        userId: req.user
      })

      if (response) {
        res.status(200).json(response);
      } else {
        res.status(400).json({
          message: 'Error update todo',
          error: 'Todo not found / You are not autorized'
        });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error
      });
    }
  }
}

module.exports = TodoController;