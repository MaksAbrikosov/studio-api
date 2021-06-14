const path = require("path");
const fs = require("fs");
const { readdir } = require( "fs/promises");
const FormData = require("form-data");
const config = require("./config.js");

const getAllAdvertisers = require("./functions/getAllAdvertisers");
const getAllCampaigns = require("./functions/getAllCampaigns");
const getAllCreatives = require("./functions/getAllCreatives");
const createNewCreative = require("./functions/createNewCreative");
const readFilesFromFolder = require("./functions/readFilesFromFolder");
const removeAssets = require("./functions/removeAssets");
const getAssetsFromCreative = require("./functions/getAssetsFromCreative");
const setBackupImage = require("./functions/setBackupImage");

let accountId;
let advertiserId;
let ownerId;
let campaignId;
let entityId;

async function start() {

  const campaigns = await getAllCampaigns();
  const creatives = await getAllCreatives();
  const selectCampaign = campaigns.records.find(
      (campaign) => campaign.name === config.CAMPAIGN_NAME
  );

  if(!selectCampaign){
    console.log('Campaign not exist')
    return;
  }

  accountId = selectCampaign.account.id;
  advertiserId = selectCampaign.advertiser.id;
  ownerId = selectCampaign.entityRef.entityKey.ownerId;
  campaignId = selectCampaign.entityRef.entityKey.entityId;

  //read creative name from creative folder
  const directoryPath = path.join(__dirname, "creatives");

  try {
    // read creatives folder
    const folders = await readdir(directoryPath);
    for (const creativeName of folders)
    {
      let filePath = path.join(directoryPath, creativeName);
      const form = new FormData();
      form.append("folder", fs.createReadStream(filePath));

      const creative = creatives.records.find((item) => item.name === creativeName);
      let creativeId;

      if (creative) {
        creativeId = creative.id;
        entityId = creative.entityRef.entityKey.entityId;

        console.log(`Creative ${creativeName} has already exist! Updating...!`)

        //TODO - fix var
        var {assetsArray, backupImage} = await getAssetsFromCreative(creativeId, advertiserId, ownerId, entityId);

        if(assetsArray && assetsArray.length > 0){
          await removeAssets(assetsArray, creativeId, advertiserId, ownerId, entityId);
          console.log('Assets deleted');
        }
      } else {
        // create a new creative in Studio
        creativeId = await createNewCreative(creativeName, accountId, advertiserId, campaignId);
        console.log(`Creative ${creativeName} created!`);
      }

      // upload assets from local folder
      await readFilesFromFolder(creativeName, creativeId, accountId, advertiserId);

      if(backupImage){
        // find backup image and select
        await setBackupImage(creativeId, backupImage, advertiserId)
      }
    }
    console.log('Done')
  } catch (err) {
    console.error(err);
  }
}

start();
