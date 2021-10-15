const {Router} = require('express')
const router = Router()
const readCreativeDirectory = require('../functions/readCreativeDirectory')
const start = require('../functions/start')
const getCampaign = require('../functions/getCampaign')
const getXsrfToken = require("../functions/getXsrfToken");
const progressUpload = require("../functions/progressUpload")
const checkIfCreativeExist = require("../functions/checkIfCreativeExist")

const parseConfigFile = require("../functions/parseConfigFile")
const  addCreativeDirPath = require("../functions/addCreativeDirPath")

let accountParameters = {}
let creativesData = {}

router.get('/', async (req, res) => {

    const {pathToFolder} = parseConfigFile()

    let data;
    if(pathToFolder.length > 0){
        data = await readCreativeDirectory(pathToFolder)
    }

    res.render('index', {
        creatives: data,
        // pathToFolder: pathToFolder,
        pathToFolder: encodeURIComponent(JSON.stringify(pathToFolder)),
        encodedJsonData : encodeURIComponent(JSON.stringify(data)),
    })
})

router.post('/check-assets',  async (req, res) => {
    const { campaignId, advertiserId, ownerId, creativePath, creatives} = req.body
    // const {pathToFolder} = parseConfigFile()

    let  result

    creativesData = Object.keys(creatives).reduce((acc, key) => {
        if(creatives[key].data.length){
            acc[key] = creatives[key]
        }
        return acc
    }, {})

    accountParameters = { campaignId, advertiserId, ownerId, creativePath}

    if(Object.keys(creativesData).length > 0){
        result = await checkIfCreativeExist(accountParameters, creativesData)
    }

    const {accountId, xsrfToken, allCreativesFromStudio} = result

    accountParameters = { ...accountParameters, accountId, xsrfToken, allCreativesFromStudio}

    res.status(200).json({messageImageWarning: result.imageSizeMessages, message: result.messages})

})

router.post('/complete',  async (req, res) => {
    progressUpload({type: 'clear'})

    if(Object.keys(creativesData).length > 0){
        // await start( campaignId, advertiserId, ownerId, creativePath, filteredData, accountParameters)
        await start(accountParameters, creativesData)
    }

    // if(!pathToFolder.length>0){
    //     await addCreativeDirPath(accountParameters.creativePath)
    // }

    await addCreativeDirPath(accountParameters.creativePath)

    res.status(200).json({message: progressUpload()})
})

router.post('/check-campaign',  async (req, res) => {
    const { campaignId, advertiserId, ownerId } = req.body

    const xsrfToken = await getXsrfToken()

    accountParameters = { campaignId, advertiserId, ownerId}

    const campaign = await getCampaign(accountParameters, xsrfToken)

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

router.get('/progress',  async (req, res) => {
    res.status(200).json({message: progressUpload()})
})

module.exports = router