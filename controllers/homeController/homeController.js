var express = require('express')
var router = express.Router()

const donatees = require('../../models/investmentopportunities')

router.get("/", function(req, res) {
    //res.render("Home/home")
    donatees.find({}, function(err, donateesInDb) {
        if (err) {
            console.log(err)
        } else {

            //due to section 2
            res.render("Home/home", { data: donateesInDb })
        }
    })
})

router.get('/about', async(req, res) => {

    res.render('Aboutus/Aboutus')
})

/**Footer Page Routes */

module.exports = router