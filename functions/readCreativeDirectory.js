const path = require("path");
const { readdir, unlink } = require( "fs/promises");
const fs = require("fs");

async function readCreativeDirectory() {
    try{
        let result ={}
        const hiddenFiles = /(^|\/)\.[^\/\.]/g;
        const allFiles = /[^\\]*\.(\w+)$/;
        const creativeDirPath = path.join(__dirname, "/../creatives")

        const creativeFolders = await readdir(creativeDirPath)

        for (const creativeName of creativeFolders) {
            if (!hiddenFiles.test(creativeName) && !allFiles.test(creativeName)) {
                const sizeDirPath = path.join(__dirname, "/../creatives/", creativeName);
                const creativeDirSize = await readdir(sizeDirPath);

                let sizeDir = []

                for (const creativeSize of creativeDirSize) {
                    if (!hiddenFiles.test(creativeSize) && !allFiles.test(creativeSize) ) {
                        sizeDir.push(creativeSize)
                        result[creativeName] = sizeDir
                    }
                }
            }
        }
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = readCreativeDirectory