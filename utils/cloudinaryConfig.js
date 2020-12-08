const cloud = require('cloudinary').v2
const donationopp = require('../models/investmentopportunities');

//Cloudinary Configuration
cloud.config({
    cloud_name: process.env.FUNDSTRTR_CLOUD_NAME,
    api_key: process.env.FUNDSTRTR_CLOUD_API,
    api_secret: process.env.FUNDSTRTR_CLOUD_SECRET,
});

const uploadPhoto = async(req, res, mediaType, sImage, size) => {
    // if theres no files object in the request object
    if (!req.files) {
        req.flash("error_message", "No file selected/found")
            // res.redirect(`/my-profile/${req.user.id}`)

        return res.status(400).json({
            status: 'error',
            message: 'No files selected'
        })

    }

    const imageFile = await req.files.photo;

    if (!(imageFile.mimetype === mediaType || imageFile.mimetype === sImage))
        return res.status(400).json({
            status: 'error',
            message: 'Invalid file format'
        })

    if (imageFile.size > size) {
        return res.status(400).json({
            status: 'error',
            message: 'Upload the file equivalent or greater than file size specified'
        })
    }

    try {
        //check if user has a pitch
        const pitch = await donation - opportunities.findOne({ email: req.user.email });
        if (pitch) {
            const businessUpload = await cloud.uploader.upload(imageFile.tempFilePath, {
                use_filename: true,
                folder: `Businesses/${pitch.tradingName}`,
                width: 350,
                height: 260,
                crop: "scale"
            });
            const { url } = businessUpload;
            return url;
        } else {
            const userLogoUpload = await cloud.uploader.upload(imageFile.tempFilePath, {
                use_filename: true,
                folder: `profilePics`
            });
            const { url } = userLogoUpload;
            return url;
        }

        // console.log(url)


    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        })

    }
}


// //////
// const uploadTeamPhoto = async(req, res, mediaType, sImage, size) => {
//     //if theres no files object in the request object
//     if (!req.files) {
//         req.flash("error_message", "No file selected/found")

//         return res.status(400).json({
//             status: 'error',
//             message: 'No files selected'
//         })

//     }

//     const imageFile = req.files.photo;

//     if (!(imageFile.mimetype === mediaType || imageFile.mimetype === sImage))
//         return res.status(400).json({
//             status: 'error',
//             message: 'Invalid file format'
//         })

//     if (imageFile.size > size) {
//         return res.status(400).json({
//             status: 'error',
//             message: 'Upload file equivalent or lower than file size specified'
//         })
//     }

//     try {
//         //check if user has a pitch
//         const pitch = await donation-opportunities.findOne({ email: req.user.email });
//         if (pitch) {
//             const businessUpload = await cloud.uploader.upload(imageFile.tempFilePath, {
//                 use_filename: true,
//                 folder: `business/${pitch.tradingName}`
//             });
//             const { url } = businessUpload;
//             return url;
//         } else {
//             const userLogoUpload = await cloud.uploader.upload(imageFile.tempFilePath, {
//                 use_filename: true,
//                 folder: `profilePics`
//             });
//             const { url } = userLogoUpload;
//             return url;
//         }


//     } catch (err) {
//         return res.status(500).json({
//             status: 'error',
//             message: 'Internal server error'
//         })

//     }
// }

module.exports = uploadPhoto;
// module.exports = uploadTeamPhoto;