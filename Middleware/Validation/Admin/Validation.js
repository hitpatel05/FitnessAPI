const { Login, ResetPassword } = require("./Schema.Validation");

const LoginValidator = async (req, res, next) => {
    const { error } = await Login.validate(req.body);
    if (error) {
        res.json({ status: 2, message: error.details[0].message });
    }
    else
        next();
}

const ResetPasswordValidator = async (req, res, next) => {
    const { error } = await ResetPassword.validate(req.body);
    if (error) {
        res.json({ status: 2, message: error.details[0].message });
    }
    else
        next();
}

module.exports = {
    LoginValidator,
    ResetPasswordValidator
};