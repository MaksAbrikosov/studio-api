const path = require("path");
const fs = require("fs");
// const { readdir } = require( "fs/promises");
const FormData = require("form-data");
// const config = require("../config.js");
const getXsrfToken = require("./getXsrfToken");


// const getAllAdvertisers = require("./getAllAdvertisers");
const getAllCampaigns = require("./getAllCampaigns");
const getAllCreatives = require("./getAllCreatives");
const createNewCreative = require("./createNewCreative");
const readFilesFromFolder = require("./readFilesFromFolder");
const removeAssets = require("./removeAssets");
const getAssetsFromCreative = require("./getAssetsFromCreative");
const searchBackupImage = require("./searchBackupImage");
const setBackupImage = require("./setBackupImage");

const getCampaign = require("./getCampaign")



let accountId;
// let advertiserId;
// let ownerId;
// let campaignId;
let entityId;


async function start(campaignId, advertiserId, ownerId, creativePath, data) {

    // if(!campaignName.length){
    //     console.log('Input Campaign Name')
    //     return;
    // }


  // const campaigns = await getAllCampaigns(xsrfToken);


  // const selectCampaign = campaigns.records.find(
  //     (campaign) => campaign.name === campaignName
  // );
  //
  // if(!selectCampaign){
  //   console.log('Campaign not exist')
  //   return;
  // }

    const xsrfToken = await getXsrfToken()
    const creatives = await getAllCreatives(xsrfToken);
    const campaign = await getCampaign(campaignId, advertiserId, ownerId, entityId, xsrfToken)
    accountId = campaign.account.id;

  // accountId = selectCampaign.account.id;
  // advertiserId = selectCampaign.advertiser.id;
  // ownerId = selectCampaign.entityRef.entityKey.ownerId;
  // campaignId = selectCampaign.entityRef.entityKey.entityId;

  //read creative name from creative folder
  // const directoryPath = path.join(__dirname, "/../creatives");
  //   const directoryPath = creativePath

  try {
    // read creatives folder
    // const folders = await readdir(directoryPath);
    // for (const creativeName of folders)


    //   for (const creativeName of creativeNames)
    //
    //   {
      for(const name of Object.keys(data)){
          for(const size of Object.values(data[name].data)){

              // const creativeName = `${data[name].newName}_${size}`
              const creativeName = data[name].newName;

              let filePath = path.join(creativePath, creativeName+size);
              const form = new FormData();
              form.append("folder", fs.createReadStream(filePath));
              const creative = creatives.records.find((item) => item.name === creativeName+size);


              let creativeId;
              if (creative) {
                creativeId = creative.id;
                entityId = creative.entityRef.entityKey.entityId;

                console.log(`Creative ${creativeName}${size} has already exist! Updating...!`)

                const assetsArray = await getAssetsFromCreative(creativeId, advertiserId, ownerId, entityId, xsrfToken);

                if(assetsArray && assetsArray.length > 0){
                  await removeAssets(assetsArray, creativeId, advertiserId, ownerId, entityId, xsrfToken);
                  console.log('Assets deleted');
                }
              } else {
                // create a new creative in Studio
                creativeId = await createNewCreative(creativeName, size, accountId, advertiserId, campaignId, xsrfToken);
                console.log(`Creative ${creativeName}${size} created!`);
              }

              // await getAllCampaigns(xsrfToken)
              // upload assets from local folder
              await readFilesFromFolder(creativeName, creativeId, accountId, advertiserId, name, size, creativePath);

              // const backupImage = await searchBackupImage(creativeId, advertiserId, ownerId, entityId, xsrfToken);
              // if(backupImage){
              //   // set backup image and select
              //   await setBackupImage(creativeId, backupImage, advertiserId, xsrfToken)
              //   console.log('Backup Image is marked')
              // }
          }
      }
      console.log('Done')
  } catch (err) {
    console.error(err);
  }
}

module.exports = start
// start();
