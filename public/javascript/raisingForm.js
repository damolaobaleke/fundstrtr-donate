$(document).ready(function() {
    $('#welcome').fadeIn(2000, function() {

    });
    var companyWebsiteInput = document.getElementById("companywebsite")
    let raisingAmount = document.getElementById('raisingAmount')
    let pmv = document.getElementById('pmv');


    pmv.addEventListener('input', function() {
        //pmv.value = pmv.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    })


    $(companyWebsiteInput).one('mouseover', function() {
        companyWebsiteInput.value = "https://"
    })

    // raisingAmount.addEventListener('input', () => {
    //     raisingAmount.value = numberWithCommas(raisingAmount.value)
    // })

    raisingAmount.addEventListener('mouseover', function() {
        let minimum = document.getElementById('minimum')
        minimum.style.display = "block"
    })
    raisingAmount.addEventListener('mouseleave', function() {
        let minimum = document.getElementById('minimum')
        minimum.style.display = "none"
    })

    function numberWithCommas(x) {
        return x.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

});


const progressText = [...document.querySelectorAll(".step p")];
const progressCheck = [...document.querySelectorAll(".step .check")];
const bullet = [...document.querySelectorAll(".step .bullet")];

const pageOne = document.querySelector(".slide-page");
const pageFour = document.querySelector(".page-four");
const pageTwo = document.querySelector(".page-two");
const pageThree = document.querySelector(".page-three");
const pages = [pageOne, pageTwo]; // pageThree, pageFour
let current;

let sliderObjectCreator = function(iconObject, pageNo, pageElement, activeUrl, deactiveUrl, previousBtn, nextBtn) {
    let goToNextPage = (page) => function() {

        if (validator(pageElement)) {
            pageElement.style.display = "none";
            bullet[current - 1].classList.add("active"); //pos 1 (2-1)
            progressText[current - 1].classList.add("active");
            page.setToCurrent();
        }

    };

    let goToPreviousPage = (page) => function() {

        // go to the previous page
        pageElement.style.display = "none";
        if (iconObject.getAttribute("src") === activeUrl) {
            iconObject.setAttribute("src", deactiveUrl)
        }

        bullet[current - 2].classList.remove("active");
        progressText.slice(current - 2, progressText.length).forEach(pt => pt.classList.remove("active"));
        page.setToCurrent();

    };

    return {
        setToCurrent: function() {
            for (const pageObject of pages) {
                // hide all pages
                pageObject.style.display = "none"
            }
            // display the current page
            pageElement.style.display = "block";
            // set current page number
            current = pageNo;
            // set active icon
            iconObject.setAttribute("src", activeUrl);
            progressText[current - 1].classList.add("active");
        },

        init: function(prevPage, nextPage) {

            if (nextPage != null && nextPage !== undefined) {
                //console.log(nextBtn);
                nextBtn.addEventListener("click", e => {
                    goToNextPage(nextPage)()
                })
            }

            if (prevPage != null && prevPage !== undefined) {
                //console.log(previousBtn);
                previousBtn.addEventListener("click", e => {
                    goToPreviousPage(prevPage)()
                });

            }

            pageElement.style.display = "none";

        }
    }
};

let slideOne = sliderObjectCreator(
    document.querySelector(".personal-info-icon"),
    1,
    pageOne, // page-element
    "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/outline_gvh9h8.png",
    "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/outline_gvh9h8.png",
    null,
    document.querySelector(".firstNext"));

let slideTwo = sliderObjectCreator(
    document.querySelector(".business-info-icon"), //icon
    2,
    pageTwo, //page-element
    "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1472090_1_1_ogf3xb.png",
    "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/1472090_1_cq2ulv.png",
    document.querySelector(".prev-1"), // previous page btn
    null); // next page btn;

// let slideThree = sliderObjectCreator(
//     document.querySelector(".company-info-icon"),
//     3,
//     pageThree,
//     "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1969973_1_fvttfi.png",
//     "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/023_Sign_Form_x3p5bq.png",
//     document.querySelector(".prev-2"),
//     document.querySelector(".next-2"));

// let slideFour = sliderObjectCreator(
//     document.querySelector(".extended-info-icon"),
//     4,
//     pageFour,
//     "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/3163198_1_p0camo.png",
//     "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/outline_1_tfhbgo.png",
//     document.querySelector(".prev-3"),
//     null);


// fully initialize( set the event handlers)
slideOne.init(null, slideTwo);
slideTwo.init(slideOne, null); //from slide one to two
// slideThree.init(slideTwo, slideFour);
// slideFour.init(slideThree, null);

slideOne.setToCurrent();

//add submission functionality
document.getElementById("submitBtn").addEventListener("click", function() {
    bullet[bullet.length - 1].classList.add("active");
    progressCheck[progressCheck.length - 1].classList.add("active");
    progressText[progressText.length - 1].classList.add("active");
    current = bullet.length;

    let email = document.getElementById("email")
    let personalInfo;

    personalInfo = {
        email: email.value,
        // Name: 'Damola'
    }
    console.log(email.value)

    //POST personalInfo object to early-access route and add in req.body -- Causes post method to be ran twice prevent event default
    // return fetch("/early-access", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(personalInfo) //post request body to server side
    // });

});


var companyCountry = document.getElementById("companyCountry");
companyCountry.addEventListener("input", function() {
    var other = document.getElementById("other");
    if (companyCountry.value === "other") {
        console.log(companyCountry.value);
        other.style.display = "block"
    } else {
        console.log(companyCountry.value);
        other.style.display = "none"
    }
});


function validator(pageObject) {
    let noOfErrors = 0;
    let inputs = pageObject.getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute("required") && inputs[i].value.trim() === "") {
            noOfErrors++;
            errors();
            break;
        }
    }
    if (noOfErrors === 0) {
        let selects = pageObject.getElementsByTagName("select");
        for (j = 0; j < selects.length; j++) {
            if (selects[j].hasAttribute("required") && selects[j].value.trim() === "") {
                noOfErrors++;
                errors();
                break;
            }
        }
    }
    return noOfErrors === 0

}

function errors() {
    let error = document.getElementsByClassName('error');
    for (let i = 0; i < error.length; i++) {
        error[i].style.display = "block"
    }
}

function validate(x) {
    var error = document.getElementsByClassName("error")
    for (i = 0; i < x.length; i++) {
        if (x.value === "") {
            for (i = 0; i < error.length; i++) {
                error.style.display = "block"
            }

        }
    }
}


// //Image Icons
// let businessInfo = document.querySelector(".business-info-icon");
// let companyInfo = document.querySelector(".company-info-icon");
// let extendedInfo = document.querySelector(".extended-info-icon")

// const slidePage = document.querySelector(".slide-page");
// var stepper = document.querySelector(".stepper")

// const pageTwo = document.querySelector(".page-two")
// const pageThree = document.querySelector(".page-three")
// const card = document.querySelector(".card")

// const nextBtnFirst = document.querySelector(".firstNext");
// const nextBtnSec = document.querySelector(".next-1");
// const nextBtnThird = document.querySelector(".next-2");

// const prevBtnOne = document.querySelector(".prev-1");
// const prevBtnTwo = document.querySelector(".prev-2");
// const prevBtnThree = document.querySelector(".prev-3");

// const submitBtn = document.getElementById("submitBtn");

// const progressText = [...document.querySelectorAll(".step p")];
// const progressCheck = [...document.querySelectorAll(".step .check")];
// const bullet = [...document.querySelectorAll(".step .bullet")];
// let max = 4;
// let current = 1;

// var form = document.querySelector('.form-outer form')
//     /**NEXT BUTTONS */

// nextBtnFirst.addEventListener("click", function() {
//     slidePage.style.marginLeft = "-0%"; //1 multiple  -3
//     // form.style.width = "200%"

//     // pageTwo.style.marginLeft = "-8rem"
//     bullet[current - 1].classList.add("active"); //pos 0
//     progressCheck[current - 1].classList.add("active");
//     progressText[current - 1].classList.add("active");
//     changeImageIcon()
//     current += 1; //0+1

//     // var inputs = document.getElementsByClassName('one')
//     // validate(inputs)
// });


// nextBtnSec.addEventListener("click", function() {
//     slidePage.style.marginLeft = "-33.3%"; //12 multiples -36

//     if (pageThree.style.display = "none") {
//         pageThree.style.display = "block"
//     }
//     bullet[current - 1].classList.add("active"); //pos 1 (2-1)
//     progressCheck[current - 1].classList.add("active");
//     progressText[current - 1].classList.add("active");
//     // changeImageIcon()
//     if (companyInfo.getAttribute("src") === "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/023_Sign_Form_x3p5bq.png") {
//         companyInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1969973_1_fvttfi.png")
//     }
//     current += 1;
// });

// nextBtnThird.addEventListener("click", function() {
//     slidePage.style.marginLeft = "-102%"; // multiples -106
//     form.style.width = "145%"

//     if (pageThree.style.display = "block") {
//         pageThree.style.display = "none"
//     }

//     bullet[current - 1].classList.add("active");
//     progressCheck[current - 1].classList.add("active");
//     progressText[current - 1].classList.add("active");
//     if (extendedInfo.getAttribute("src") === "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/outline_1_tfhbgo.png") {
//         extendedInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/3163198_1_p0camo.png")
//     }
//     current += 1;
// });

// submitBtn.addEventListener("click", function() {
//     bullet[current - 1].classList.add("active");
//     progressCheck[current - 1].classList.add("active");
//     progressText[current - 1].classList.add("active");
//     current += 1;
//     setTimeout(function() {
//         //alert("Your Form Successfully Signed up");
//         location.reload();
//     }, 800);
// });


// /**PREVIOUS BUTTONS */

// prevBtnOne.addEventListener("click", function() {
//     slidePage.style.marginLeft = "-0%";
//     form.style.width = "300%"

//     bullet[current - 2].classList.remove("active");
//     progressCheck[current - 2].classList.remove("active");
//     progressText[current - 2].classList.remove("active");
//     let image1 = businessInfo.getAttribute("src")
//     if (image1 == "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1472090_1_1_ogf3xb.png") {
//         businessInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/1472090_1_cq2ulv.png")
//     }
//     current -= 1;
// });

// prevBtnTwo.addEventListener("click", function() {
//     if (pageThree.style.display = "block") {
//         pageThree.style.display = "none"
//     }
//     var stepTwoInputs = document.getElementsByClassName('two')

//     //changeInputWidth(stepTwoInputs)

//     slidePage.style.marginLeft = "-50%"; // -58
//     bullet[current - 2].classList.remove("active");
//     progressCheck[current - 2].classList.remove("active");
//     progressText[current - 2].classList.remove("active");
//     //Company image Icon
//     if (companyInfo.getAttribute("src") === "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1969973_1_fvttfi.png") {
//         companyInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/023_Sign_Form_x3p5bq.png")
//     }

//     current -= 1;
// });

// prevBtnThree.addEventListener("click", function() {
//     if (pageThree.style.display = "none") {
//         pageThree.style.display = "block"
//         var stepThreeInputs = document.getElementsByClassName('three')

//         //changeInputWidth(stepThreeInputs)

//     }
//     slidePage.style.marginLeft = "-100%"; //-98
//     form.style.width = "200%"
//     bullet[current - 2].classList.remove("active");
//     progressCheck[current - 2].classList.remove("active");
//     progressText[current - 2].classList.remove("active");
//     if (extendedInfo.getAttribute("src") === "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/3163198_1_p0camo.png") {
//         extendedInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/outline_1_tfhbgo.png")
//     }
//     current -= 1;
// });

// function changeInputWidth(x) {
//     //var stepThreeInputs = document.getElementsByClassName('three')
//     for (i = 0; i < x.length; i++) {
//         x[i].style.width = "48%"
//     }
// }

// function validate(x) {
//     var error = document.getElementsByClassName("error")
//     var inputs = document.getElementsByClassName('one')
//     inputs.forEach(function(input) {
//         if (input.value = "") {
//             for (i = 0; i < error.length; i++) {
//                 error.style.display = "block"
//             }

//         }
//     });
// }

// function changeImageIcon() {
//     if (bullet[0]) {
//         let image1 = businessInfo.getAttribute("src")
//         if (image1 == "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/1472090_1_cq2ulv.png") {
//             businessInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1472090_1_1_ogf3xb.png")
//         }
//     } else if (bullet[1]) {
//         if (companyInfo.getAttribute("src") === "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597756115/Fundstrtr/023_Sign_Form_x3p5bq.png") {
//             companyInfo.setAttribute("src", "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1597848846/Fundstrtr/1969973_1_fvttfi.png")
//         }
//     } else {

//     }
// }

// // array.forEach(function (item, index) {
// //     console.log(item, index);
// //   });