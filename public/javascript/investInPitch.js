var amountToCharge = document.getElementById("valueInvesting")
var displayError = document.getElementById('card-errors');

function errorHandler(err) {
    changeLoadingState(false);
    displayError.textContent = err;
}

//For client to view
var totalAmount = document.getElementById('totalAmount')
var stripeFees = 0.59
var investmentFees = 1.5 / 100 * amountToCharge.value
var totalCalculatedAmount = stripeFees + investmentFees + amountToCharge.value

//object sent to server side
var orderData;

amountToCharge.addEventListener("input", function() {

    orderData = {
        items: [{
            id: "invest-in-pitch"
        }],
        currency: "usd",
        chargeAmount: amountToCharge.value
    };
    console.log(amountToCharge.value)

    /**Change total amount displayed */
    //totalAmount.style.textContent = "Total: $" + totalCalculatedAmount
})

//For client to view

// var orderData = {
//     items: [{
//         id: "invest-in-pitch"
//     }],
//     currency: "usd",
//     chargeAmount: amountToCharge.value
// };

// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

//Change back to live
var stripe = Stripe("pk_test_51GxxDoK2qfQUDJH6Wu9e3mV1nK4TBdxvAsAlODQIzX3FfgVtgxigPRT18ZAMSGjJJv5wMYWbl8fCKLgGjEy0A0rW00yCDyfpYo");
var elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
var style = {
    base: {
        color: "#283990",
        fontSize: '16px',
        border: '1px solid rgba(40, 57, 144, 0.5)',
        fontFamily: 'Montserrat, sans-serif',
        fontSmoothing: "antialiased",
        "::placeholder": {
            color: " #7C7C7C"
        }
    },

};

var card = elements.create("card", { style: style });
card.mount("#card-element");

/**var cardNumber = elements.create('cardNumber', { style: style, });
cardNumber.mount('#card-number');

var cardExpiry = elements.create('cardExpiry', { style: style, });
cardExpiry.mount('#card-expiry');

var cardCvc = elements.create('cardCvc', { style: style, });
cardCvc.mount('#card-cvc');**/

//handle ERROR on card input change
card.addEventListener('change', function(event) {
    if (event.error) {
        errorHandler(event.error.message);
    } else {
        errorHandler('');
    }
});

// cardNumber.addEventListener('change', function(event) {
//     if (event.error) {
//         errorHandler(event.error.message);
//     } else {
//         errorHandler('');
//     }
// });
// cardExpiry.addEventListener('change', function(event) {
//     if (event.error) {
//         errorHandler(event.error.message);
//     } else {
//         errorHandler('');
//     }
// });
// cardCvc.addEventListener('change', function(event) {
//     if (event.error) {
//         errorHandler(event.error.message);
//     } else {
//         errorHandler('');
//     }
// });




var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();

    //inderteminate progress bar
    changeLoadingState(true);

    //create payment method from the card {type: 'card', card: card: card, billing_details: {name: 'Jenny Rosen'},}
    stripe.createPaymentMethod('card', card)
        .then(function(result) {
            if (result.error) {
                errorHandler(result.error.message);
            } else {
                console.log(result)
                orderData.paymentMethodId = result.paymentMethod.id; //pull 'paymentMethod.id' id from the result

                //Takes id of pitch = <%=data._id%>
                const pitchId = document.querySelector(".pitch-id")
                console.log(`${pitchId.value}`)

                const userId = document.querySelector(".user-id").value

                return fetch(`/donation-opportunities/pitches/${pitchId.value}/invest/${userId}/pay`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData) //post request body to server side
                });
            }
        })
        .then(function(result) {
            //debugger
            return result.json(); //return result of posting to pay route
        })
        .then(function(response) {
            //sent from caught error in server side
            if (response.error) {
                errorHandler(response.error);
            } else {
                changeLoadingState(false);
                //redirect to /portfolio(eventually) with query string stating payment as true
                window.location.href = '/donation-opportunities?invested=true'
            }
        }).catch(function(err) {
            errorHandler(err.error);
        });
});

function changeLoadingState(isLoading) {
    if (isLoading) {
        document.querySelector(".invest-button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector(".invest-button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}