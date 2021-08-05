const {Router} = require('express')
const router = Router()
const readCreativeDirectory = require('../functions/readCreativeDirectory')
const start = require('../functions/start')
const getCampaign = require('../functions/getCampaign')
const getXsrfToken = require("../functions/getXsrfToken");

router.get('/', async (req, res) => {

    const data = await readCreativeDirectory()

    res.render('index', {
        // title: 'testTitle',
        creatives: data,
    })
})

router.post('/complete',  async (req, res) => {
    const { campaignId, advertiserId, ownerId, creatives} = req.body


    const filteredData = Object.keys(creatives).reduce((acc, key) => {
        if(creatives[key].data.length){
            acc[key] = creatives[key]
        }
        return acc
    }, {})

    await start( campaignId, advertiserId, ownerId, filteredData)
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


module.exports = router