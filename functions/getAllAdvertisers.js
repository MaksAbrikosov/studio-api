const config = require('../config')
const axios = require('axios')


function getAllAdvertisers(){
    const arguments = [
      {
        "pageNumber":1,
        "pageSize":10000,
        "isDescendingSort":true,
        "ids":[],
        "sortOption":"CHANGE_DATE"
      }
    ]
    const payload = {
      service: 'AdvertiserService',
      method: 'search',
      arguments: arguments.map(JSON.stringify)
    }
  
    axios({
      method: 'post',
      url: "https://www.google.com/doubleclick/studio/service",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "text/plain",
          // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
          "x-xsrf-token": "AMUEn62zXQ0oV5WkAROO970szyyRABWyFw:1623938273924",
          "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
  
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      data: JSON.stringify(payload),
      referrer: "https://www.google.com/doubleclick/studio/",
      mode: "cors"
    })
    .then(body => console.log(body.data))
    .catch(err => {
      console.error(err);
    });
  }

module.exports = getAllAdvertisers
  