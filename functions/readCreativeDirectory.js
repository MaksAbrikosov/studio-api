const path = require("path");
const { readdir } = require( "fs/promises");

async function readCreativeDirectory() {

    const creativeDirPath = path.join(__dirname, "/../creatives")

    let result ={}

    const creativeFolders = await readdir(creativeDirPath)

    for (const creativeName of creativeFolders) {

        const sizeDirPath = path.join(__dirname, "/../creatives/", creativeName);
        const creativeDirSize = await readdir(sizeDirPath);

        let sizeDir = []

        for (const creativeSize of creativeDirSize) {
            sizeDir.push(creativeSize)
            result[creativeName] = sizeDir
        }
    }
    return result
}

module.exports = readCreativeDirectory