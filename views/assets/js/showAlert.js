function showAlert(msg, alertContainer, imageMsg, type){

    if(msg instanceof Object || imageMsg && imageMsg instanceof Object){
        //remove all child
        while (alertContainer.firstChild) {
            alertContainer.removeChild(alertContainer.firstChild)
        }

        const divTag = document.createElement("div");

        if(imageMsg && imageMsg.length > 0 ){
            let tagH5 = document.createElement("h5");
            tagH5.setAttribute('class', 'mb-2 mt-1 modalWarningHeader')
            let text = document.createTextNode("Backup image is more than 40kb");
            tagH5.appendChild(text);
            divTag.appendChild(tagH5);
            imageMsg.map(item => {
                let tagP = document.createElement("p");
                tagP.setAttribute('class', 'mb-1')
                let text = document.createTextNode(item);
                tagP.appendChild(text);
                divTag.appendChild(tagP);
            })
        }
        if(msg.length > 0 ){
            if(type && type === 'alert'){
                let tagH5 = document.createElement("h5");
                tagH5.setAttribute('class', 'mb-2 mt-3 modalWarningHeader')
                let text = document.createTextNode("Selected creatives exist in Studio");
                tagH5.appendChild(text);
                divTag.appendChild(tagH5);
            }
      
            msg.map(item => {
                let tagP = document.createElement("p");
                tagP.setAttribute('class', 'mb-1')
                let text = document.createTextNode(item);
                tagP.appendChild(text);
                divTag.appendChild(tagP);
            })
        }

        alertContainer.appendChild(divTag);

    } else {
        document.getElementsByClassName("alert")[0].style.display = "block";
        document.getElementsByClassName('alertMsg')[0].innerHTML = msg;
    }

}