const axios = require("axios");
const config = require("../config");

function getAssetsFromCreative(creativeId, advertiserId, ownerId, entityId){

    const arguments = [
        {
            "id":advertiserId,
            "entityKey":{
                "entityId":advertiserId,
                "ownerId":ownerId
            }
        },
        {
            "id":creativeId,
            "entityKey":{
                "entityId":entityId,
                "ownerId":ownerId
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
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
            "x-xsrf-token": "AMUEn60pHm58xh8g8DNwq2sRfmJtCfkJYA:1623245986563",
            "cookie": `${config.Secure3PSID} ${config.SID}`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        mode: "cors",
    })
        .then(response => {
            const assetsArray = [...response.data.assets.map(item=> item.assetRef)]
            const backupImage = response.data.assets.find(item => item.originalFilename.match(/backup/)).originalFilename
            return {assetsArray, backupImage}
        })
        .catch(err => console.error(err.response));
}

module.exports = getAssetsFromCreative;