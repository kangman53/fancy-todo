const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: {
    type: 'ObjectId',
    ref: 'User'
  },
  status: {
    type: Boolean,
    default: false
  },
  name: { 
    type: String,
    required: 'Todo name is required!',
    minlength: [5, 'Todo name must contains at least 5 characters']
  },
  description: { 
    type: String,
    required: 'Todo description is required!',
    minlength: [5, 'Todo desciption must contains at least 5 characters']
  },
  date_created: Date,
  due_date: {
    type: Date,
    required: 'Due date is required!'
  },
  date_finished: {
    type: Date,
    default: null
  }
})

todoSchema.pre('save', function(next) {
  let date_created = new Date();
  this.date_created = date_created.setUTCHours(date_created.getHours());
  next();
})

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo