const { kMaxLength } = require('buffer');
const { timeStamp } = require('console');
const mongoose = require('mongoose');
const { type } = require('os');
const { PassThrough } = require('stream');
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');   

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required : true,
        unique : true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type: String,
        default:"https://media.istockphoto.com/id/1553217327/vector/user-profile-icon-avatar-person-sign-profile-picture-portrait-symbol-easily-editable-line.jpg?s=170667a&w=0&k=20&c=xUuHLFaa94WIFdV-XBgxX9SSsaJJgGQhE1Tmevqrytg="
    },
    about:{
        type: String,
        default:"Hello I am on Dev Tinder"
    },
    skill:{
        type:[String]
    }
},
{
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user}, "DEV@Tinder$790", {expiresIn: "7d"});

    return token;
};

userSchema.methods.validatePassword = async function (userInputPass) {
    const user = this;
    const passHash = user.password; 
    const isValidPassword = await bcrypt.compare(userInputPass, passHash);

    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema)