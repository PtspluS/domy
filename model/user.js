var crypto = require('crypto')
var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    phoneNumber : {
        type : Number,
        unique : true,
        required : false,
        trim : true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    }
  });

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        ((err, result)=> {
            if(crypto.createHash('sha256').update(password).digest('hex') === user.password){
                return callback(null, user);
            } else {
                return callback();
            }
        })()
      });
  }

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    let hash = crypto.createHash('sha256').update(user.password).digest('hex');
    user.password = hash;
    next();
});

var User = mongoose.model('User', UserSchema);
module.exports = User;