const Joi = require("@hapi/joi");

const schema = {
    Register: Joi.object({
        //profile: Joi.string().allow('').optional(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        confirmpassword: Joi.string().required().min(6).equal(Joi.ref('password'))
            // .options({ messages: { 'any.only': '{{#label}} does not match'} })
            .options({ messages: { 'any.only': 'password and confirm password should be same.' } }),
        phoneno: Joi.number().required(),
        age: Joi.number().required(),
        gender: Joi.string().required(),
        heightisfeet: Joi.boolean().required(),
        height: Joi.number().required(),
        weightiskg: Joi.boolean().required(),
        weight: Joi.number().required(),
        equipmentavailable: Joi.string().allow('').optional(),
        fitnessgoals: Joi.string().allow('').optional(),
        otherfitnessgoals: Joi.string().allow('').optional(),
        injuriesorhelthissues: Joi.string().allow('').optional(),
        emailnotifications: Joi.boolean().optional().default(false),
        maillinglist: Joi.boolean().optional().default(false),
        textnotifications: Joi.boolean().optional().default(false),
        webnotifications: Joi.boolean().optional().default(false),
        mobilenotifications: Joi.boolean().optional().default(false)
    }),

    UpdateProfile: Joi.object({
        edprofile: Joi.string().allow('').optional(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().required().email(),
        phoneno: Joi.number().required(),
        age: Joi.number().required(),
        gender: Joi.string().required(),
        heightisfeet: Joi.boolean().required(),
        height: Joi.number().required(),
        weightiskg: Joi.boolean().required(),
        weight: Joi.number().required(),
        equipmentavailable: Joi.string().allow('').optional(),
        fitnessgoals: Joi.string().allow('').optional(),
        otherfitnessgoals: Joi.string().allow('').optional(),
        injuriesorhelthissues: Joi.string().allow('').optional(),
        emailnotifications: Joi.boolean().optional().default(false),
        maillinglist: Joi.boolean().optional().default(false),
        textnotifications: Joi.boolean().optional().default(false),
        webnotifications: Joi.boolean().optional().default(false),
        mobilenotifications: Joi.boolean().optional().default(false),

        oldpassword: Joi.string().allow('').min(6),
        password: Joi.string().allow('').min(6),
        confirmpassword: Joi.string().allow('').min(6),
        progressphotos: Joi.array().optional()
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

    SessionRequest: Joi.object({
        trainerid: Joi.string().required(),
        date: Joi.date().required(),
        starthour: Joi.string().required(),
        endhour: Joi.string().required(),
        startdatetime: Joi.date(),
        enddatetime: Joi.date(),
        requestType: Joi.number().optional()
    })
};

module.exports = schema;