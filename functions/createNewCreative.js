const axios = require("axios");
const config = require("../config");

async function createNewCreative(creativeName, accountId, advertiserId, campaignId) {

    let creativeId = '';
    const creativeSize = creativeName.split("_")[1];
    const creativeWidth = creativeSize.split('x')[0];
    const creativeHeight = creativeSize.split('x')[1];

    const arguments = [
        {
            "accountRef":{
                "id": accountId
            },
            "advertiserRef":{
                "id": advertiserId,
            },
            "campaignRef":{
                "id": campaignId
            },
            "format": "INPAGE",
            "dimension": {
                "width": creativeWidth,
                "height":creativeHeight
            },
            "name": creativeName
        }
    ];
    const payload = {
        service: 'CreativeService',
        method: 'insert',
        arguments: arguments.map(JSON.stringify)
    }

    await axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCN3yywE=",
            "x-xsrf-token": "AMUEn63GmScZaPxjMU3CGmaBZ2kiACuzqA:1622623233506",
            "cookie": `${config.Secure3PSID} ${config.SID}`
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        referrer: "https://www.google.com/doubleclick/studio/",
        mode: "cors"
    })
        .then(response => creativeId =  response.data.id)
        .catch(err => console.error(err));

    return creativeId
}

module.exports = createNewCreative;