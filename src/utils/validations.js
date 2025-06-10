const validator = require("validator")

function ValidateSignUp(req) {
    const { firstname, lastname, emailId, password, age, gender } = req.body

    const isValidEmail = validator.isEmail(emailId)
    if (!isValidEmail) {
        throw new Error("Invalid email");
    }

    const isValidPassword = validator.isStrongPassword(password)
    if (!isValidPassword) {
        throw new Error("Invalid Password");
    }

}

function ValidateLogin(req) {
    const { emailId, password } = req.body;

    const isValidEmail = validator.isEmail(emailId)
    if (!isValidEmail) {
        throw new Error("Invalid email");
    }

}
const validateEditProfile = (req) => {
    const data = req.body;
    const ALLOWED_UPDATES = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "photoUrl"
    ]
    const isUpdateAllowed = Object.keys(data).every((k) =>
        ALLOWED_UPDATES.includes(k)
    )
    return isUpdateAllowed
}

module.exports = { ValidateSignUp, ValidateLogin, validateEditProfile}