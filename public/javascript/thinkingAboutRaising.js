var img_tech = "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1591032719/Fundstrtr/Technology_sector_fuipjt.png"
var img1_tech = "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"

var img_agric = "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1591039055/Fundstrtr/Agriculture_sector_mmbhcl.png"
var img1_agric = "https://images.unsplash.com/photo-1492496913980-501348b61469?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"

var img_re = "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1591039055/Fundstrtr/Real_Estate_sector_zv0ioq.png"
var img1_re = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=966&q=80"

var img_ft = "https://res.cloudinary.com/https-eazifunds-com/image/upload/v1591039055/Fundstrtr/FinTech_sector_qjziku.png"
var img1_ft = "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"

function changeSectorTech() {
    var sectorTech = document.getElementById("sector-tech")
    if (sectorTech.getAttribute("src") == img_tech) {
        sectorTech.setAttribute("src", img1_tech)
    } else {
        sectorTech.setAttribute("src", img_tech)
    }
}

function SectorAgric() {
    var sectorAgric = document.getElementById("sector-agric")
    if (sectorAgric.getAttribute("src") == this.img_agric) {
        sectorAgric.setAttribute("src", this.img1_agric)
    } else {
        sectorAgric.setAttribute("src", this.img_agric)
    }
}


function SectorRealEstate() {
    var realEstate = document.getElementById("sector-re")
    if (realEstate.getAttribute("src") == this.img_re) {
        realEstate.setAttribute("src", this.img1_re)
    } else {
        realEstate.setAttribute("src", this.img_re)
    }
}

function SectorFinTech() {
    var finTech = document.getElementById("sector-fintech")
    if (finTech.getAttribute("src") == this.img_ft) {
        finTech.setAttribute("src", this.img1_ft)
    } else {
        finTech.setAttribute("src", this.img_ft)
    }
}