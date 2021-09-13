function parseCampaignUrl() {
    const creativeUrlValue = document.getElementsByName('creativeUrl')[0].value

    if(!creativeUrlValue.length){
        showAlert(' <strong>Campaign URL is empty!</strong> Please enter URL ')
        document.getElementsByClassName("checkCampaignIdBtn")[0].style.display = "block";
        document.getElementsByClassName("loadingCheckCampaign")[0].style.display = "none";
        return;
    }

    // const campaignId = creativeUrlValue.slice(creativeUrlValue.indexOf('campaignId='), creativeUrlValue.indexOf('&')).split("=")[1]
    const parseUrl = creativeUrlValue.split(/\=|&/)
    const campaignId = parseUrl[1]
    const advertiserId = parseUrl[3]
    const ownerId = parseUrl[5]

    return {
        campaignId,
        advertiserId,
        ownerId
    }
}