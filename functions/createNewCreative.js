const axios = require("axios");
const config = require("../config");

async function createNewCreative(creativeName, size, accountParameters) {

    // const nameArrayLength = creativeName.split("_").length
    //
    // const creativeSize = creativeName.split("_")[nameArrayLength-1];
    // const creativeWidth = creativeSize.split('x')[0];
    // const creativeHeight = creativeSize.split('x')[1];

    const creativeWidth = size.split('x')[0];
    const creativeHeight = size.split('x')[1];

    const arguments = [
        {
            "accountRef":{
                "id": accountParameters.accountId
            },
            "advertiserRef":{
                "id": accountParameters.advertiserId,
            },
            "campaignRef":{
                "id": accountParameters.campaignId
            },
            "format": "INPAGE",
            "dimension": {
                "width": creativeWidth,
                "height":creativeHeight
            },
            "name": creativeName+size
        }
    ];
    const payload = {
        service: 'CreativeService',
        method: 'insert',
        arguments: arguments.map(JSON.stringify)
    }

    return await axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCN3yywE=",
            "x-xsrf-token": accountParameters.xsrfToken,
            "cookie": `${config.Secure3PSID} ${config.SID}`
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        referrer: "https://www.google.com/doubleclick/studio/",
        mode: "cors"
    })
        .then(response => {
            return response.data.id
        })
        .catch(err => console.error(err));
}

module.exports = createNewCreative;