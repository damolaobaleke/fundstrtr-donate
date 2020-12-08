$(document).ready(function() {
    $().ready(function() {
        $sidebar = $('.sidebar');
        $navbar = $('.navbar');
        $main_panel = $('.main-panel');

        $full_page = $('.full-page');

        $sidebar_responsive = $('body > .navbar-collapse');
        sidebar_mini_active = true;
        white_color = false;

        window_width = $(window).width();

        fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

        $('.fixed-plugin a').click(function(event) {
            if ($(this).hasClass('switch-trigger')) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else if (window.event) {
                    window.event.cancelBubble = true;
                }
            }
        });

        $('.fixed-plugin .background-color span').click(function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');

            var new_color = $(this).data('color');

            if ($sidebar.length != 0) {
                $sidebar.attr('data', new_color);
            }

            if ($main_panel.length != 0) {
                $main_panel.attr('data', new_color);
            }

            if ($full_page.length != 0) {
                $full_page.attr('filter-color', new_color);
            }

            if ($sidebar_responsive.length != 0) {
                $sidebar_responsive.attr('data', new_color);
            }
        });

        $('.switch-sidebar-mini input').on("switchChange.bootstrapSwitch", function() {
            var $btn = $(this);

            if (sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                sidebar_mini_active = false;
                blackDashboard.showSidebarMessage('Sidebar mini deactivated...');
            } else {
                $('body').addClass('sidebar-mini');
                sidebar_mini_active = true;
                blackDashboard.showSidebarMessage('Sidebar mini activated...');
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function() {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function() {
                clearInterval(simulateWindowResize);
            }, 1000);
        });

        //Theme 
        $('.switch-change-color input').on("switchChange.bootstrapSwitch", function() {
            var $btn = $(this);

            if (white_color == true) {
                $('body').addClass('change-background');
                setTimeout(function() {
                    $('body').removeClass('change-background');
                    $('body').removeClass('white-content');
                }, 900);
                white_color = false;
            } else {

                $('body').addClass('change-background');
                setTimeout(function() {
                    $('body').removeClass('change-background');
                    $('body').addClass('white-content');
                }, 900);

                white_color = true;
            }


        });

        //Theme Badges
        $('.light-badge').click(function() {
            $('body').addClass('white-content');
        });

        $('.dark-badge').click(function() {
            $('body').removeClass('white-content');
        });

        $('.nav li').click(function(event) {
            $('.active').removeClass('active');

            //add active class to clicked link
            $(this).addClass('active');

        });
    });
});

var inputs = document.getElementsByTagName('input')
for (i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("click", function() {
        this.classList.toggle("input-border")
    })
}

//Nominee and Direct Investments
//var nomineeBtn = document.getElementById('nominee')
//var directInvestmentsBtn = document.getElementById('direct_investments')
var nomineeChoice = document.getElementById('nomineeInput')
var directInvestmentsChoice = document.getElementById('direct_investmentsInput')



// nomineeBtn.addEventListener('click', function() {
//     if (nomineeBtn.className = "btn btn-secondary") {
//         nomineeChoice.value = "false"
//         directInvestmentsBtn.className = "btn btn-secondary active"
//         console.log(nomineeChoice.value)
//     } else if (nomineeBtn.className = "btn btn-secondary active") {
//         nomineeChoice.value = "true"
//         directInvestmentsBtn.className = "btn btn-secondary"
//     } else {
//         nomineeChoice.value = "true"
//     }
// })

// directInvestmentsBtn.addEventListener('click', function() {
//     if (directInvestmentsBtn.className = "btn btn-secondary active") {
//         directInvestmentsChoice.value = "true"
//         nomineeBtn.className = "btn btn-secondary"
//         console.log("direct investment active")
//     } else {
//         directInvestmentsChoice.value = "false"
//         console.log("Not Active")
//     }
// })

//Not needed - Was thinking
// var confirmBtn = document.getElementById('confirm')
// confirmBtn.addEventListener('click', function(ev){
//     ev.preventDefault()

//     var investmentOptions = [{
//         nominee: {type: Boolean, default: true},
//         directInvestment: {type: Boolean, default: true}
//     }]

//     return fetch("/donation-opportunitiesp", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(investmentOptions) //post request body to server side
//     });
// })