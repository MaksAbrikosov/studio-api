const axios = require("axios");
const { parse } = require("node-html-parser");
const config = require("../config");

async function getXsrfToken(){
    return axios({
        method: 'get',
        url: "https://www.google.com/doubleclick/studio/",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIxdDKAQi6/coBCKCgywEIrPLLAQjc8ssBCI34ywEItPjLAQie+csBGI6eywEYuvLLAQ==",
            "cookie": `${config.Secure3PSID} ${config.SID}`,
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        data:  null,
        mode: "cors"
    })
        .then(body => {
            const root = parse(body.data);
            const node = root.querySelector('script')
            const xsrfTokenString = node.rawText.split(',').filter(val => val.match(/xsrfToken/))[0]
            // const xsrfToken = xsrfTokenString.replace(' "xsrfToken": ', "")
            const xsrfToken = xsrfTokenString.split('"')[3]
            return xsrfToken
        })
        .catch(err => {
            console.error(err);
        });
}

module.exports = getXsrfToken;