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
        "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEI+MfKAQi6/coBCKmdywEIoKDLAQisoMsBCN3yywEIp/PLAQ==",
        "x-xsrf-token": "AMUEn61PkgcYkUWu292_EJfTCtwQkt3VPw:1622560921719",
        // "cookie": "SID=-Qfc9RQh4ozXBnvpZjglobeUkx9wOX4OB_9rNzbSobYJKslCV61NCJ-qQWzYJcOYGp0WZQ.; __Secure-3PSID=-Qfc9RQh4ozXBnvpZjglobeUkx9wOX4OB_9rNzbSobYJKslCp2JYnF6-dvluX7jphZFEZA.;"
        "cookie": config.Secure3PSID
  
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      data: JSON.stringify(payload),
      referrer: "https://www.google.com/doubleclick/studio/",
      method: "POST",
      mode: "cors"
    })
    .then(body => console.log(body.data))
    .catch(err => {
      console.error(err);
    });
  }

module.exports = getAllAdvertisers
  