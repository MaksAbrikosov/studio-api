const axios = require("axios");
const config = require("../config");
const progressUpload = require("./progressUpload")

async function uploadFile(url, setCookie, form, fileName, fullNameForAlert, increaseCountUploaded){

    await axios({
        method: 'post',
        url: url,
        headers: {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-client-data": "CCI22yQEIpLbJAQjEtskBCKmdygEIuv3KAQigoMsBCNzyywE=",
            "x-goog-upload-command": "upload, finalize",
            "x-goog-upload-file-name": fileName,
            "x-goog-upload-offset": "0",
            "cookie": `__Secure-3PSID=${config.Secure3PSID}; SID=${config.SID};`,
        },
        referrer: "https://www.google.com/doubleclick/studio/",
        referrerPolicy: "strict-origin-when-cross-origin",
        data: form,
        mode: "cors",
    })
        .then(() => {
            console.log(`File ${fullNameForAlert} was uploaded`)
            progressUpload({type: "add", message: `Creative ${fullNameForAlert} was uploaded`})
            increaseCountUploaded()
        })
        .catch(err =>{
            console.error(err.response)
            progressUpload(`Error! ${fullNameForAlert} - ${err.response.statusText}`)
            progressUpload({type: "add", message: `Error! ${fullNameForAlert} - ${err.response.statusText}`})
        });
}

module.exports = uploadFile;