const axios = require("axios");
const config = require("../config");

async function removeAssets(assets, creativeId, advertiserId, ownerId, entityId, xsrfToken){

    const arguments = [
        {
            "entityKey":{
                "entityId":advertiserId,
                "ownerId":ownerId
            },
            "id":advertiserId,
        },
        {
            "entityKey":{
                "entityId":entityId,
                "ownerId":ownerId
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
            // "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            // "sec-ch-ua-mobile": "?0",
            // "sec-fetch-dest": "empty",
            // "sec-fetch-mode": "cors",
            // "sec-fetch-site": "same-origin",
            // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
            "x-xsrf-token": xsrfToken,
            "cookie": `${config.Secure3PSID} ${config.SID}`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        mode: "cors",
    })
        .catch(err => console.error(err.response));
}

module.exports = removeAssets;