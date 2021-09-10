const path = require("path");
const fs = require("fs");
// const { readdir } = require( "fs/promises");
const FormData = require("form-data");
// const config = require("../config.js");
const getXsrfToken = require("./getXsrfToken");

const getAllCreatives = require("./getAllCreatives");
const removeAssets = require("./removeAssets");
const getAssetsFromCreative = require("./getAssetsFromCreative");
const getCampaign = require("./getCampaign")
const progressUpload = require("./progressUpload")

let accountId;
let entityId;

async function checkIfCreativeExist(campaignId, advertiserId, ownerId, creativePath, data) {

    const xsrfToken = await getXsrfToken()

    if(!xsrfToken){
        return
    }


    const creatives = await getAllCreatives(xsrfToken);
    const campaign = await getCampaign(campaignId, advertiserId, ownerId, entityId, xsrfToken)
    accountId = campaign.account.id;

    const messages = []

    try {
        for(const name of Object.keys(data)){
            for(const size of Object.values(data[name].data)){

                // const creativeName = `${data[name].newName}_${size}`
                const creativeName = data[name].newName;

                const fullNameForAlert = `${creativeName}${size}`

                let filePath = path.join(creativePath, creativeName+size);
                const form = new FormData();
                form.append("folder", fs.createReadStream(filePath));
                const creative = creatives.records.find((item) => item.name === creativeName+size);


                let creativeId;
                if (creative) {
                    creativeId = creative.id;
                    entityId = creative.entityRef.entityKey.entityId;

                    messages.push(fullNameForAlert)
                }
            }
        }
        return messages
    } catch (err) {
        console.error(err);
    }
}

module.exports = checkIfCreativeExist
// start();
