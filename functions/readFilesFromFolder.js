const path = require("path");
const fs = require("fs");
const { readdir } = require( "fs/promises");

const getUrl = require("./getUrl");
const uploadFile = require("./uploadFile");

async function readFilesFromFolder(creativeName, creativeId, accountId, advertiserId){

    const directoryPath = path.join(__dirname, `../creatives/${creativeName}`);

    const files = await readdir(directoryPath);
    for (const file of files) {

        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath);
        const url = await getUrl(creativeId, file, accountId, advertiserId);

        const {uploadUrl, setCookie} = url;

        if(Object.keys(url).length > 0){
            await uploadFile(uploadUrl, setCookie, fileContent, file)
        }
    }
}

module.exports = readFilesFromFolder;