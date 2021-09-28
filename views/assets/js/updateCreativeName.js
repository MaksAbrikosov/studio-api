//////////////////////////////////////////////////////////////////////////////////////////
// Changes checkbox labels when changed creative name

// TODO -  debounce or throttle
function debounce(fn, ms = 150) {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
            // fn.apply(this, args)
        }, ms)
    }
}

function updateValue(node, nameId, value){
    let arrSizes = []

    node.querySelectorAll('.lab').forEach(
        (element, i) => {
            if(!cardObj[nameId]){
                const sizes = element.innerHTML.split('_')[1]
                arrSizes.push(sizes)
            }
        }
    )
    // changedName = true
    if(!cardObj[nameId]) {
        cardObj[nameId] = arrSizes
    }
    node.querySelectorAll('.lab').forEach((el, i) => {
        el.innerText = `${value}${cardObj[nameId][i]}`
    })

}

const debouncedUpdateValue = debounce(updateValue)

const updateCreativeName = () => {
    document.querySelectorAll('.cardIn').forEach((node, i) => {
        node.querySelector('.creativeName').addEventListener("input", function() {
            const nameId = node.getElementsByClassName('creativeName')[0].id
            const changedCreativesName =node.querySelector('.creativeName').getAttribute('value')
            changedName[changedCreativesName] = true
            debouncedUpdateValue(node, nameId, this.value)
        })
    })
}

updateCreativeName()