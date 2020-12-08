//setInvestValue = function() {
var moneyInput = document.getElementsByTagName('input')
var investButton = document.getElementsByClassName('invest-button')

for (i = 0; i < moneyInput.length; i++) {
    moneyInput[i].addEventListener("input", function() {
        // if (this.value % 10 == 0) {
        //     console.log("divisible by 10")
        //     buttonEnabled()
        // } else {
        //     console.log("not a multiple of 10")
        //     buttonDisabled()
        // }
    })
}
//}

function buttonEnabled() {
    for (i = 0; i < investButton.length; i++) {
        investButton[i].classList.add('btn-enabled')
    }
}

function buttonDisabled() {
    for (i = 0; i < investButton.length; i++) {
        investButton[i].classList.add('btn-disabled')
        investButton[i].classList.remove('btn-enabled')
    }
}

for (i = 0; i < moneyInput.length; i++) {
    var alert1 = document.getElementById('alert')
    moneyInput[i].addEventListener("mouseenter", function() {
        alert1.style.display = "block"
        alert1.style.color = "red"
    })
    moneyInput[i].addEventListener("mouseleave", function() {
        alert1.style.display = "none"
    })
}

var nominee = document.getElementById('fs-nominee')
var directInvestment = document.getElementById('fs-direct')

var isclicked = true;
directInvestment.addEventListener('click', function() {
    if (isclicked) {
        directInvestment.classList.add('option-picked')
        isclicked = false
    } else {
        isclicked = false
        directInvestment.classList.remove('option-picked')
        isclicked = true;
    }
})

nominee.addEventListener('click', function() {
    nominee.classList.add('option-picked')
})