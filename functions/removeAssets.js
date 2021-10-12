const axios = require("axios");
const config = require("../config");

async function removeAssets(assets, accountParameters, creativeId, entityId){

    const arguments = [
        {
            "entityKey":{
                "entityId":accountParameters.advertiserId,
                "ownerId":accountParameters.ownerId
            },
            "id":accountParameters.advertiserId,
        },
        {
            "entityKey":{
                "entityId":entityId,
                "ownerId":accountParameters.ownerId
            },
            "id":creativeId,
        },
        assets
    ]

    const payload = {
        service: 'CreativeService',
        method: 'removeAssets',
        arguments: arguments.map(JSON.stringify)
    }

    await axios({
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
        .catch(err => console.error(err.response));
}

module.exports = removeAssets;