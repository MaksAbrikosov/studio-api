const path = require("path");
const fs = require("fs");
// const { readdir } = require( "fs/promises");

const getUrl = require("./getUrl");
const uploadFile = require("./uploadFile");

let archiver = require('archiver');

async function  readFilesFromFolder(creativeName, creativeId, accountId, advertiserId, name, size, creativePath, fullNameForAlert){

    // create archive
    const zipName = size + ".zip";
    // const source = path.join(__dirname, `../creatives/${name}/${size}`);
    // const output = path.join(__dirname, `../creatives/${name}`, zipName);
    // const pathToZipFile = path.join(__dirname, `../creatives/${name}/${zipName}`)

    const source = path.join(creativePath, `${name}/${size}`);
    const output = path.join(creativePath, `${name}`, zipName);
    const pathToZipFile = path.join(creativePath, `${name}/${zipName}`)



    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(output);

    await archive
        .directory(source, false)
        .on('error', err => {throw err;})
        .pipe(stream);

    stream.on('close', () => console.log("closed"));
    await archive.finalize();
    console.log(`Archive ${zipName} created`);

    const url = await getUrl(creativeId, zipName, accountId, advertiserId);

    const {uploadUrl, setCookie} = url;

    const fileContent = fs.readFileSync(pathToZipFile);

    if(Object.keys(url).length > 0){
        // upload
        await uploadFile(uploadUrl, setCookie, fileContent, zipName, fullNameForAlert)
        // remove archive
        fs.unlinkSync(pathToZipFile)
        console.log(`Archive ${zipName} deleted`);

    }
}

module.exports = readFilesFromFolder;