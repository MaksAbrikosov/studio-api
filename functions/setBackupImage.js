const axios = require("axios");
const config = require("../config");

function setBackupImage(creativeId, backupImage, accountParameters){

    const arguments = [`${accountParameters.advertiserId}`, `${creativeId}`, `${backupImage}`]

    const payload = {
        service: 'CreativeService',
        method: 'setBackupImage',
        arguments: arguments.map(JSON.stringify)
    }

    axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCN3yywE=",
            "x-xsrf-token": accountParameters.xsrfToken,
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        referrer: "https://www.google.com/doubleclick/studio/",
        mode: "cors"
    })
}

module.exports = setBackupImage;