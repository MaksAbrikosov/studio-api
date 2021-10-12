const axios = require("axios");
const config = require("../config");

function searchBackupImage(creativeId, accountParameters, entityId){

    const arguments = [
        {
            "id":accountParameters.advertiserId,
            "entityKey":{
                "entityId":accountParameters.advertiserId,
                "ownerId":accountParameters.ownerId
            }
        },
        {
            "id":creativeId,
            "entityKey":{
                "entityId":entityId,
                "ownerId":accountParameters.ownerId
            }
        }
    ]

    const payload = {
        service: 'CreativeService',
        method: 'get',
        arguments: arguments.map(JSON.stringify)
    }

    return axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            "x-xsrf-token": accountParameters.xsrfToken,
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        mode: "cors",
    })
        .then(response => {
            return response.data.assets.find(item => item.originalFilename.match(/backup/)).originalFilename
        })
        .catch(err => console.error(err.response));
}

module.exports = searchBackupImage;
