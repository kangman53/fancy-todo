const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hashPassword } = require('../helpers')
const userSchema = new Schema({
  fullname: {
    type: String,
    minlength: [3, 'Fullname minimum have 3 characters']
  },
  email: {
    type: String,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email format is invalid'],
    validate: [
      {
        isAsync: true,
        validator: function(value, callback) {
          User.findOne({
              email: value,
              _id: {
                $ne: this._id
              }
            }, (err, member) => {
              if (member || err) {
                callback(false)
              } else {
                callback(true)
              }
            })
        },
        message: 'This email address is already registered'
      }
    ]
  },
  password: {
    type: String,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number']
  },
  picture_url: String
});

userSchema.pre('save', function (next) {
  this.password = hashPassword(this.password);
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User