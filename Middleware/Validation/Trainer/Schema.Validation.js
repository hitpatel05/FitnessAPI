const Joi = require("@hapi/joi");

const schema = {
    Register: Joi.object({
        // coverprofile: Joi.string().allow('').optional(),
        // profile: Joi.string().allow('').optional(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        confirmpassword: Joi.string().required().min(6).equal(Joi.ref('password'))
            .options({ messages: { 'any.only': 'password and confirm password should be same.' } }),
        phoneno: Joi.number().required(),
        gender: Joi.string().required(),
        aboutus: Joi.string().allow('').optional(),
        trainingstyle: Joi.string().allow('').optional(),
        quote: Joi.string().allow('').optional(),
        experience: Joi.number(),
        specialitys: Joi.string().allow('').optional(),
        introduction: Joi.string().allow('').optional(),
        emailnotifications: Joi.boolean(),
        maillinglist: Joi.boolean(),
        textnotifications: Joi.boolean(),
        // qualifications: Joi.object().optional(),
        // certifications: Joi.object().optional(),
    }),
    UpdateProfile: Joi.object({
        edcoverprofile: Joi.string().allow('').optional(),
        edprofile: Joi.string().allow('').optional(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneno: Joi.number().required(),
        gender: Joi.string().required(),
        aboutus: Joi.string().allow('').optional(),
        trainingstyle: Joi.string().allow('').optional(),
        quote: Joi.string().allow('').optional(),
        experience: Joi.number(),
        specialitys: Joi.string().allow('').optional(),
        introduction: Joi.string().allow('').optional(),
        emailnotifications: Joi.boolean(),
        maillinglist: Joi.boolean(),
        textnotifications: Joi.boolean(),

        // qualifications: Joi.object().optional(),
        // certifications: Joi.object().optional(),

        oldpassword: Joi.string().allow('').min(6),
        password: Joi.string().allow('').min(6),
        confirmpassword: Joi.string().allow('').min(6)
    }),
    Login: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    }),
    ResetPassword: Joi.object({
        password: Joi.string().required().min(6),
        confirmpassword: Joi.string().required().min(6).equal(Joi.ref('password'))
            .options({ messages: { 'any.only': 'password and confirm password should be same.' } })
    }),
    AccountInfo: Joi.object({
        userid: Joi.string().required(),
        accountholdername: Joi.string().required(),
        accountnumber: Joi.string().required(),
        bankname: Joi.string().required(),
        swiftcode: Joi.string().required()
    })
};

module.exports = schema;