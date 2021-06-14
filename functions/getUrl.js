const axios = require("axios");
const config = require("../config");

 function getUrl(creativeId, fileName, accountId, advertiserId) {

  const payload = {
    TYPE: "CREATIVE",
    ACCOUNT_ID: accountId,
    ADVERTISER_ID: advertiserId,
    CREATIVE_ID: creativeId,
  };

  return axios({
    method: "post",
    url: "https://www.google.com/doubleclick/studio/upload-http",
    headers: {
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
      "x-goog-upload-command": "start",
      "x-goog-upload-file-name": fileName,
      "x-goog-upload-protocol": "resumable",
      cookie: `${config.Secure3PSID} ${config.SID}`,
    },
    referrer: "https://www.google.com/doubleclick/studio/",
    referrerPolicy: "strict-origin-when-cross-origin",
    data: JSON.stringify(payload),
    mode: "cors",
  })
    .then((data) => {
      let uploadUrl = data.headers["x-goog-upload-url"];
      let setCookie = data.headers["set-cookie"][0].split(";")[0];
      const conf = {uploadUrl, setCookie}
      return conf;
    })
    .catch((err) => console.log(err));
}

module.exports = getUrl;
