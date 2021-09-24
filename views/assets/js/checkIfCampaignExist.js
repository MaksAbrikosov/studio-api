function checkCampaign(){

    document.getElementsByClassName("checkCampaignIdBtn")[0].style.display = "none";
    document.getElementsByClassName("loadingCheckCampaign")[0].style.display = "block";

    const { campaignId, advertiserId, ownerId} = parseCampaignUrl()

    if(!campaignId && !advertiserId && !ownerId){
        showAlert(' <strong>Error! Please check campaign URL</strong> ')
        return;
    }

    const result = {
        campaignId,
        advertiserId,
        ownerId
    }

    fetch("/check-campaign", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    })
    .then(response => response.json())
    .then(data => {
        const {accountName, advertiserName, campaignName} = data;
        showAlert(`Path in Studio : ${accountName} | ${advertiserName} | ${campaignName}`)
        document.getElementsByClassName("checkCampaignIdBtn")[0].style.display = "block";
        document.getElementsByClassName("loadingCheckCampaign")[0].style.display = "none";
    })
    .catch(err => {
        console.log(err)
    })
}
