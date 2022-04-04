const fs = require("fs");

async function errorLog(apiName, reqBody, fileContent){
    return new Promise((resolve, reject) => {
        var errMsg = "";
        var defaultfileContent = fs.readFileSync("./public/logs/logs.txt");
        console.log(defaultfileContent);
        errMsg += (defaultfileContent || "") + "\n";
        errMsg += "Date : " + (new Date()) + "\n";
        errMsg += "API NAME : " + apiName + "\n";
        errMsg += "Request Body : " + JSON.stringify(reqBody) + "\n";
        errMsg += "---------------"+ "\n" + fileContent + "\n";
        errMsg += "---------------"+ "\n";
        errMsg += "---------------";
        //fileContent = (defaultfileContent || "") +"\n"+ fileContent;
        fileContent = errMsg;
        fs.writeFileSync("./public/logs/logs.txt", fileContent, writeFileError => {
            if (writeFileError) {
                reject(writeFileError);
                return;
            }
            resolve(filePath);
        });
    });
}

module.exports = {
    errorLog
};