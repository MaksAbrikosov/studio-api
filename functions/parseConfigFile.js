const path = require("path");
const fs = require('fs');

function parseConfigFile(){
    let filePath = path.join(__dirname, '../config.js');
    let pathToFolder = "";
    const dirStringRegExp = /^(.*)CreativeDir(.*)\:(.*)$/gm

    const fileContent = fs.readFileSync(filePath).toString('utf8')
    // console.log(fileContent.split("\n"))

    if(dirStringRegExp.test(fileContent)){
        const folderFromConfig = fileContent.match(dirStringRegExp)[0].trim()
        pathToFolder = folderFromConfig.split(":")[1].trim().slice(1,-2)
    }
    return {
        fileContent,
        pathToFolder
    }
}

module.exports = parseConfigFile;