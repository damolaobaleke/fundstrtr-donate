//Investment opportunities blur
let userId = document.querySelector('.user').value

$(document).ready(function() {
    showBlurContent()

    $(window).on('scroll', function() {
        var pixels = $(document).scrollTop() //ScrollY
        pixels = pixels / 100;
        console.log(pixels)

        //IF NO CURRENT USER OR USER LOGGED IN
        if (userId === null) {

            //change to add class later (SOC)
            $(".pitches").css({
                //blur pixels by the amount of pixels gotten
                "-webkit-filter": "blur(" + pixels + "px)",
                "filter": "blur(" + pixels + "px)",
                "cursor": "none"
            })

            //showBlurContent()
        } else {
            $(".pitches").css({
                //blur pixels by the amount of pixels gotten
                "-webkit-filter": "none",
                "filter": "none",
                "cursor": "pointer"
            })

        }

    });
})


function showBlurContent() {
    var blur = document.getElementsByClassName('blur-bg')

    //might need to set to show at a particular height scrollY
    for (i = 0; i < blur.length; i++) {
        blur[i].style.display = "block"

        // $(".blur-bg").slideUp(3000)
    }
    //var pitchLinks = document.getElementsByClassName('fs-pitch-link')
    // for (i = 0; i < pitchLinks.length; i++) {
    //     pitchLinks.style.cursor = "none"
    // }

}