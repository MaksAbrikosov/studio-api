function showAlert(msg, alertContainer){

    if(msg instanceof Object){
        //remove all child
        while (alertContainer.firstChild) {
            alertContainer.removeChild(alertContainer.firstChild)
        }

        const divTag = document.createElement("div");

        msg.map(item => {
            let tagP = document.createElement("p");
            // tagP.setAttribute('class', `alertParagraph` )
            let text = document.createTextNode(item);
            tagP.appendChild(text);
            divTag.appendChild(tagP);
        })

        alertContainer.appendChild(divTag);

    } else {
        document.getElementsByClassName("alert")[0].style.display = "block";
        document.getElementsByClassName('alertMsg')[0].innerHTML = msg;
    }

}