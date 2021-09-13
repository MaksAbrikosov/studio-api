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
    try {
        for(const name of Object.keys(data)){
            for(const size of Object.values(data[name].data)){

                const creativeName = data[name].newName;

                const fullNameForAlert = `${creativeName}${size}`

                let filePath = path.join(accountParameters.creativePath, creativeName+size);
                const form = new FormData();
                form.append("folder", fs.createReadStream(filePath));

                if (accountParameters.creative) {


                    console.log(`Creative ${fullNameForAlert} has already exist! Updating...!`)
                    progressUpload(`Creative ${fullNameForAlert} has already exist! Updating...!`)

                    const assetsArray = await getAssetsFromCreative(accountParameters);

                    if(assetsArray && assetsArray.length > 0){
                        await removeAssets(assetsArray, accountParameters);
                        console.log('Assets deleted');
                        progressUpload(`Assets deleted`)
                    }
                } else {
                    // create a new creative in Studio
                    accountParameters.creativeId = await createNewCreative(creativeName, size, accountParameters)
                    console.log(`Creative ${creativeName}${size} created!`);
                    progressUpload(`Creative ${fullNameForAlert} created!`)
                }

                await readFilesFromFolder(creativeName, accountParameters, name, size, fullNameForAlert);

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