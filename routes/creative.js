const {Router} = require('express')
const router = Router()
const readCreativeDirectory = require('../functions/readCreativeDirectory')
const start = require('../functions/start')

router.get('/', async (req, res) => {

    const data = await readCreativeDirectory()

    res.render('index', {
        title: 'testTitle',
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

module.exports = router