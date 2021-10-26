const path = require("path");
const fs = require("fs");
const FormData = require("form-data");

const createNewCreative = require("./createNewCreative");
const readFilesFromFolder = require("./readFilesFromFolder");
const removeAssets = require("./removeAssets");
const getAssetsFromCreative = require("./getAssetsFromCreative");
const searchBackupImage = require("./searchBackupImage");
const setBackupImage = require("./setBackupImage");
const progressUpload = require("./progressUpload")

let countUploaded = 0
let totalCountCreatives = 0

const increaseCountUploaded = () => countUploaded++

async function start(accountParameters, data) {
    let creative;
    let creativeId;
    let entityId;

    Object.values(data).map(creative => creative.data.length).map(item => totalCountCreatives = totalCountCreatives + item)

    try {
        for (const name of Object.keys(data)) {
            for (const size of Object.values(data[name].data)) {

                const creativeName = data[name].newName;

                const fullNameForAlert = `${creativeName}${size}`

                let filePath = path.join(accountParameters.creativePath, creativeName + size);
                const form = new FormData();
                form.append("folder", fs.createReadStream(filePath));

                // creative = accountParameters.allCreativesFromStudio.records.find((item) => item.name === creativeName + size);
                creative = accountParameters.allCreativesFromStudio.records.find(item => item.name === creativeName+size && item.campaign.entityRef.id === Number(accountParameters.campaignId))

                if (creative) {
                    creativeId = creative.id;
                    entityId = creative.entityRef.entityKey.entityId;

                    console.log(`Creative ${fullNameForAlert} has already exist! Updating...!`)
                    progressUpload({
                        type: "add",
                        message: `Creative ${fullNameForAlert} has already exist! Updating...!`
                    })

                    const assetsArray = await getAssetsFromCreative(accountParameters, creativeId, entityId);

                    if (assetsArray && assetsArray.length > 0) {
                        await removeAssets(assetsArray, accountParameters, creativeId, entityId);
                        console.log('Assets deleted');
                        progressUpload({type: "add", message: `Assets deleted!`})
                    }
                } else {
                    // create a new creative in Studio
                    const {id, entityKey} = await createNewCreative(creativeName, size, accountParameters)

                    creativeId = id
                    entityId = entityKey.entityId

                    console.log(`Creative ${creativeName}${size} created!`);
                    progressUpload({type: "add", message: `Creative ${fullNameForAlert} created!`})
                }

                await readFilesFromFolder(creativeName, accountParameters, name, size, fullNameForAlert, creativeId, increaseCountUploaded);

                const backupImage = await searchBackupImage(creativeId, accountParameters, entityId);

                if(backupImage){
                    // set backup image and select
                    await setBackupImage(creativeId, backupImage, accountParameters)
                    console.log('Backup Image is marked')
                    progressUpload({type: "add", message: `Backup Image is marked`})
                    progressUpload({type: "add", message: `-------------------------------------------------`})

                } else {
                    console.log('Backup Image not founded')
                    progressUpload({type: "add", message: `Backup Image is not founded`})
                    progressUpload({type: "add", message: `-------------------------------------------------`})

                }
            }
        }
        console.log('Done')
        progressUpload({type: "add", message: `Uploaded creatives... (${countUploaded}/${totalCountCreatives})`})
        countUploaded = 0
        totalCountCreatives = 0
    } catch (err) {
        console.error(err);
    }
}

module.exports = start