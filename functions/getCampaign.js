const axios = require("axios");
const config = require("../config");

function getCampaign(accountParameters, xsrfToken){

    const arguments = [
        {
            "id":accountParameters.advertiserId,
            "entityKey":{
                "entityId":accountParameters.advertiserId,
                "ownerId":accountParameters.ownerId
            }
        },
        {
            "id":accountParameters.campaignId,
            "entityKey":{
                "entityId":accountParameters.campaignId,
                "ownerId":accountParameters.ownerId
            }
        }
    ]

    const argumentsIfCampaignEmpty = [
        {
            "id":accountParameters.advertiserId,
            "entityKey":{
                "entityId":accountParameters.advertiserId,
                "ownerId":accountParameters.ownerId
            }
        },
        {
            "id":accountParameters.advertiserId,
            "entityKey":{
                "entityId":accountParameters.advertiserId,
                "ownerId":accountParameters.ownerId
            }
        }
    ]

    const payload = {
        service: 'CampaignService',
        method: 'get',
        arguments: arguments.map(JSON.stringify)
    }

    const payloadIfCampaignEmpty = {
        service: 'CampaignService',
        method: 'get',
        arguments: argumentsIfCampaignEmpty.map(JSON.stringify)
    }

    return axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            "x-xsrf-token": xsrfToken,
            // "cookie": `${config.Secure3PSID} ${config.SID}`,
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payload),
        mode: "cors",
    })
        .then(response => {
            return response.data
        })
        // .catch(err => console.error(err.response));
        .catch(() => {

            ifCampaignEmpty(accountParameters, xsrfToken, payloadIfCampaignEmpty)
                .then(response => {
                    return response.data
                 })
                .catch(err => console.error(err.response));
        });
}

function ifCampaignEmpty(accountParameters, xsrfToken, payloadIfCampaignEmpty){
    return axios({
        method: 'post',
        url: "https://www.google.com/doubleclick/studio/service",
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "text/plain",
            "x-xsrf-token": xsrfToken,
            // "cookie": `${config.Secure3PSID} ${config.SID}`,
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: JSON.stringify(payloadIfCampaignEmpty),
        mode: "cors",
    })
}

module.exports = getCampaign;