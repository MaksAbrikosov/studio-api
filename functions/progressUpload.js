
let progress = []

// function progressUpload(message, deleteProgressArray){
//     if(message){
//         progress.push(message)
//     }
//     if(deleteProgressArray){
//         progress = []
//     }
//     return progress
//  }

function progressUpload(data){
    if(data && data.type === 'add'){
        progress.push(data.message)
    } else if(data && data.type === 'clear'){
        progress = []
    }
    return progress
}

module.exports = progressUpload