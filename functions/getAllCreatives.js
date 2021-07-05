const config = require('../config')
const axios = require('axios')

async function getAllCreatives(xsrfToken){
    let data = {};
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
      service: 'CreativeService',
      method: 'search',
      arguments: arguments.map(JSON.stringify)
    }
  
    await axios({
      method: 'post',
      url: "https://www.google.com/doubleclick/studio/service",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "text/plain",
          // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
          "x-xsrf-token": xsrfToken,
        "cookie": config.Secure3PSID
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      data: JSON.stringify(payload),
      referrer: "https://www.google.com/doubleclick/studio/",
      mode: "cors"
    })
        .then(body => data = {...body.data})
        .catch(err => console.error(err));
  
    return data
  }

  module.exports = getAllCreatives