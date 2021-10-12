const axios = require("axios");
const { parse } = require("node-html-parser");
const config = require("../config");
const fetch = require('node-fetch')
const progressUpload = require("./progressUpload")

async function getXsrfToken(){
    return axios({
        method: 'get',
        url: "https://www.google.com/doubleclick/studio/",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            // "x-client-data": "CI22yQEIpLbJAQjEtskBCKmdygEIxdDKAQi6/coBCKCgywEIrPLLAQjc8ssBCI34ywEItPjLAQie+csBGI6eywEYuvLLAQ==",
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
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
            if(xsrfTokenString) {
                const xsrfToken = xsrfTokenString.split('"')[3]
                return xsrfToken
            }
            progressUpload({type: "add", message: `Error! Update please config file!`})

        })
        .catch(err => {
            console.error(err);
            progressUpload({type: "add", message: `Error! Update please config file!`})
        });
}

module.exports = getXsrfToken;