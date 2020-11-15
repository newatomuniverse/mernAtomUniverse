const mongoose = require("mongoose");
const crypto = require("crypto");
const { timeStamp } = require("console");

const userSchema = new mongoose.Schema({
    username: { type: String, trim: true, required: true, max: 50, unique=true, index=true, lowercase: true },
    name: { type: String, trim: true, required: true,max:50},
    email: { type: String, trim: true, required: true,max:50, lowercase:true, unique:true},
    profile: { type: String, required: true},
    hashed_password: { type: String, required: true},
    salt: String,
    salt: { type: String},
    about: { type: String},
    role: { type: Number, trim: true },
    photo: { data: Buffer, contentType:String },
    resetPasswordLink: {
        data: String,
        default:'',
    }
}, { timeStamp: true });

userSchema.virtual('password').set(function (password) {
    // temp password called _password
    this._password = password
    // generate salt
    this.salt = this.makeSalt()
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
}).get(
        function () {
    return this._password
}
)

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;

    },
    encryptPassword: function (password) {
        if (!password) return ""
        try {
            return crypto.createHmac("sha1", this.salt).update(password).digest('hex');
        } catch (err) {
            return ""
        }
    
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) +""
    }}

module.exports = mongoose.model('User', userSchema)
