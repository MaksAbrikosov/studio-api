const {Router} = require('express')
const router = Router()
const readCreativeDirectory = require('../functions/readCreativeDirectory')
const start = require('../functions/start')
const getCampaign = require('../functions/getCampaign')
const getXsrfToken = require("../functions/getXsrfToken");
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

router.get('/', async (req, res) => {

    const {pathToFolder} = parseConfigFile()

    let data;
    if(pathToFolder.length > 0){
        data = await readCreativeDirectory(pathToFolder)
    }

    res.render('index', {
        // title: 'testTitle',
        creatives: data,
        pathToFolder: pathToFolder
    })
})

router.post('/complete',  async (req, res) => {
    const { campaignId, advertiserId, ownerId, creativePath, creatives} = req.body
    const {pathToFolder} = parseConfigFile()

    const filteredData = Object.keys(creatives).reduce((acc, key) => {
        if(creatives[key].data.length){
            acc[key] = creatives[key]
        }
        return acc
    }, {})

    if(Object.keys(filteredData).length > 0){
        await start( campaignId, advertiserId, ownerId, creativePath, filteredData)
    }

    if(!pathToFolder.length>0){
        await addCreativeDirPath(creativePath)
    }
    await addCreativeDirPath(creativePath)
    res.status(200).json({message: "Creatives uploaded successfully!"})
})

router.post('/check',  async (req, res) => {
    const { campaignId, advertiserId, ownerId } = req.body
    const xsrfToken = await getXsrfToken()

    const campaign = await getCampaign(campaignId, advertiserId, ownerId, ownerId, xsrfToken)

    // console.log(campaign.account.name, campaign.advertiser.name, campaign.name)

    if(campaign){
        res.status(200).json({
            // message: "Campaign exist"
            accountName: campaign.account.name,
            advertiserName: campaign.advertiser.name,
            campaignName: campaign.name
        })
    } else {
        res.status(400).json({message: "Campaign not found"})
    }
})


router.post('/chooseDir',  async (req, res) => {
    const localPath = req.body.localPath

    let data;
    if(localPath.length>0){
        data = await readCreativeDirectory(localPath)
    }

    res.status(400).json(data)

})

module.exports = router