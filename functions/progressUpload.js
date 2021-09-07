
const progress = []

function progressUpload(message){
    if(message){
        progress.push(message)
    }
    return progress
 }

module.exports = progressUpload