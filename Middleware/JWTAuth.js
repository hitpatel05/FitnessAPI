const JWT = require("jsonwebtoken");

const JWTSECRET = process.env.JWTSECRET;

const authtoken = async function (req, res, next) {
    try {
        // const access_token = await req.cookies.access_token;
        const access_token = req.headers['authorization'];
        if (!access_token)
            req.user = { _id: "", isAuthenticated: false };
        if (access_token) {
            const verified = JWT.verify(access_token, JWTSECRET);
            if (!verified)
                req.user = { _id: "", isAuthenticated: false };
            else
                req.user = verified;
        }

        next();
    }
    catch (error) {
        res.user = { _id: "", isAuthenticated: false };
    }
}

module.exports = authtoken;