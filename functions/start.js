const path = require("path");
const fs = require("fs");
const FormData = require("form-data");

const createNewCreative = require("./createNewCreative");
const readFilesFromFolder = require("./readFilesFromFolder");
const removeAssets = require("./removeAssets");
const getAssetsFromCreative = require("./getAssetsFromCreative");
// const searchBackupImage = require("./searchBackupImage");
// const setBackupImage = require("./setBackupImage");
const progressUpload = require("./progressUpload")

async function start(accountParameters, data) {
    let creative;
    let creativeId;

    try {
        for(const name of Object.keys(data)){
            for(const size of Object.values(data[name].data)){

                const creativeName = data[name].newName;

                const fullNameForAlert = `${creativeName}${size}`

                let filePath = path.join(accountParameters.creativePath, creativeName+size);
                const form = new FormData();
                form.append("folder", fs.createReadStream(filePath));

                creative = accountParameters.allCreativesFromStudio.records.find((item) => item.name === creativeName+size);

                if (creative) {
                    // console.log('accountParameters.creative', creative)

                    creativeId = creative.id;
                    entityId = creative.entityRef.entityKey.entityId;

                    console.log(`Creative ${fullNameForAlert} has already exist! Updating...!`)
                    progressUpload({type: "add", message: `Creative ${fullNameForAlert} has already exist! Updating...!`})

                    const assetsArray = await getAssetsFromCreative(accountParameters, creativeId, entityId);

                    if(assetsArray && assetsArray.length > 0){
                        await removeAssets(assetsArray, accountParameters, creativeId, entityId);
                        console.log('Assets deleted');
                        progressUpload({type: "add", message: `Assets deleted!`})
                    }
                } else {
                    // create a new creative in Studio
                    creativeId = await createNewCreative(creativeName, size, accountParameters)
                    console.log(`Creative ${creativeName}${size} created!`);
                    progressUpload({type: "add", message: `Creative ${fullNameForAlert} created!`})
                }

                await readFilesFromFolder(creativeName, accountParameters, name, size, fullNameForAlert, creativeId);

                // const backupImage = await searchBackupImage(creativeId, advertiserId, ownerId, entityId, xsrfToken);
                // if(backupImage){
                //     // set backup image and select
                //     await setBackupImage(creativeId, backupImage, advertiserId, xsrfToken)
                //     console.log('Backup Image is marked')
                // }
            }
        }
        console.log('Done')
    } catch (err) {
        console.error(err);
    }
}

module.exports = start