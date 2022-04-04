const Joi = require("@hapi/joi");

const schema = {
    Login: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    }),

    ResetPassword: Joi.object({
        password: Joi.string().required().min(6),
        confirmpassword: Joi.string().required().min(6).equal(Joi.ref('password'))
            .options({ messages: { 'any.only': 'password and confirm password should be same.' } })
    })
};

module.exports = schema;