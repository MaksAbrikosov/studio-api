const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const getXsrfToken = require("./getXsrfToken");

const getAllCreatives = require("./getAllCreatives");
const getCampaign = require("./getCampaign")

let accountId;

async function checkIfCreativeExist(accountParameters, data) {

    let creative;

    const xsrfToken = await getXsrfToken()

    if(!xsrfToken){
        return
    }

    const allCreativesFromStudio = await getAllCreatives(xsrfToken);
    const campaign = await getCampaign(accountParameters, xsrfToken)
    accountId = campaign.account.id;

    const messages = []
    const imageSizeMessages = []

    try {
        for(const name of Object.keys(data)){
            for(const size of Object.values(data[name].data)){

                // const creativeName = `${data[name].newName}_${size}`
                const creativeName = data[name].newName;

                const fullNameForAlert = `${creativeName}${size}`

                let filePath = path.join(accountParameters.creativePath, creativeName+size);
                const form = new FormData();
                form.append("folder", fs.createReadStream(filePath));
                creative = allCreativesFromStudio.records.find((item) => item.name === creativeName+size);

                let filePathLocalFolder = path.join(accountParameters.creativePath, name,size);
                console.log('filePath', filePathLocalFolder);

                fs.readdirSync(filePathLocalFolder).forEach(file => {
                    if(file.match(/backup/)){
                        const stats = fs.statSync(path.join(filePathLocalFolder, file))
                        const fileSize = (stats.size / 1024).toFixed(1)
                        console.log('fileSize', fileSize);
                        if(fileSize > 40){
                            imageSizeMessages.push(fullNameForAlert)
                        }
                    }
                   
                  });


                if (creative) {
                    messages.push(fullNameForAlert)
                }
            }
        }
        return{
            messages,
            imageSizeMessages,
            xsrfToken,
            accountId,
            allCreativesFromStudio
        }

    } catch (err) {
        console.error(err);
    }
}

module.exports = checkIfCreativeExist
