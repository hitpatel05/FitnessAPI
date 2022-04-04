const { Register, UpdateProfile, Login, ResetPassword, SessionRequest } = require("./Schema.Validation");

const RegistrationValidator = async (req, res, next) => {
    const { error } = await Register.validate(req.body);
    if (error) {
        res.json({ status: 2, message: error.details[0].message });
    }
    else
        next();
}

const UpdateProfileValidator = async (req, res, next) => {
    const { error } = await UpdateProfile.validate(req.body);
    if (error) {
        res.json({ status: 2, message: error.details[0].message });
    }
    else
        next();
}

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

const SessionRequestValidator = async (req, res, next) => {
    const { error } = await SessionRequest.validate(req.body);
    if (error) {
        res.json({ status: 2, message: error.details[0].message });
    }
    else
        next();
}

module.exports = {
    RegistrationValidator,
    UpdateProfileValidator,
    LoginValidator,
    ResetPasswordValidator,
    SessionRequestValidator
};