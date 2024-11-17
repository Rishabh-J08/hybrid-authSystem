const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: String,
        required: false,
        unique: true
    },
    fingerprintKey:{
        type: String,
        required: false,
     },
    fingerprintChallenge: {
        type: String,
        required: false,
        unique: true,
        default: null
    },
    domainName: {  // this will be required when we have to use fingerprint logine 
        type: String, 
        required: false,
        unique: true
    }
});

//saving password
userSchema.pre(
    "save", async function (next) {
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next() 
        
    }
)

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };


module.exports = mongoose.model("User", userSchema)