const path = require("path");
const fs = require('fs');

const parseConfigFile = require("./parseConfigFile")

async function addCreativeDirPath(creativePath){

    const dirStringRegExp = /^(.*)CreativeDir(.*)\:(.*)$/gm

    const {fileContent} = await parseConfigFile()

    if(!fileContent){
        console.log('Didn`t find creativeDir in the config.js')
    }

    const fileContentArray = fileContent.split('\n')
    const indexDirString =  fileContentArray.indexOf(fileContent.match(dirStringRegExp)[0])
    if(indexDirString !== -1){
        fileContentArray[indexDirString] = `    CreativeDir: "${creativePath.toString()}",`;
        const fileContentString = fileContentArray.join("\n")
        let filePath = path.join(__dirname, '../config.js');
        fs.writeFileSync(filePath, fileContentString)
    }
}

module.exports = addCreativeDirPath;