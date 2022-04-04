const AccountInfo = require("../../Model/Trainer/AccountInfoSchema");
const { errorLog } = require("../Errorcontroller");

const SaveAccountInfo = async (req, res) => {
    try {
        // if (!req.user.isAuthenticated)
        //     return res.status(200).json({ status: 2, message: "User not logged." });

        const accountinfoInput = {
            userid: req.body.userid,
            accountholdername: req.body.accountholdername,
            accountnumber: req.body.accountnumber,
            bankname: req.body.bankname,
            swiftcode: req.body.swiftcode
        };
        const accountinfo = new AccountInfo(accountinfoInput);

        await accountinfo.save()
            .then((data) => {
                res.status(200).json({ status: 1, message: "Saved successfully.", result: data });
            })
            .catch(function (error) {
                errorLog("SaveAccountInfo", req.body, error);
                res.status(200).json({ status: 2, message: "Something getting wrong.", error: error.toString() });
            });
    }
    catch (err) {
        errorLog("SaveAccountInfo", req.body, err);
        return res.status(200).json({ status: 2, message: "Something getting wrong.", error: err.toString() });
    }
};

module.exports = { SaveAccountInfo };