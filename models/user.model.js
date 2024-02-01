const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },  
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    required: true,
    validate(value) {
        if(!validator.isStrongPassword(value)) {
            throw new Error('pAssword should contain atleast 1 uppercase & 1 lowercase, number and a special character')
        }
    }
  },
}
,
{
    timeStamp:true
})

userSchema.statics.isEmailTaken = async function (email) {
    const user = await this.findOne({ email });
    // return !!user;  user is Object but !user is a boolean 
    // so to get the correct value as a boolean we used !!user
    return !!user;
  };

const User = mongoose.model("User", userSchema);



module.exports = User;
