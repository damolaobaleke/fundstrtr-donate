const uploadPhoto = require('../../utils/cloudinaryConfig');
const uploadTeamPhoto = require('../../utils/cloudinaryConfig')
const donatees = require('../../models/investmentopportunities');

module.exports = {
    uploadFile: async(req, res) => {
        try {
            const { pitchId } = req.params;
            const donationopp = await donatees.findById(pitchId);
            const photo = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 20000); //max size 20000kb == 20Mb
            //const companyHeader = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 20000); //max size 20000kb == 20Mb
            donationopp.companyLogo = photo;
            //donation-opportunities.companyHeader = companyHeader;
            await donationopp.save();
            return res.status(200).json({
                status: 'success'
            });

        } catch (err) {
            console.log(err)
        }
    },

    uploadCompanyHeader: async(req, res) => {
        try {
            const { pitchId } = req.params;
            const donationopp = await donatees.findById(pitchId);
            const photo = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 20000); //max size 20000kb == 20Mb
            donationopp.companyHeader = photo;
            await donationopp.save();
            return res.status(200).json({
                status: 'success'
            });

        } catch (err) {
            console.log(err)
        }
    },

    uploadTeamMember1: async(req, res) => {
        try {
            const { pitchId } = req.params;
            const donationopp = await donatees.findById(pitchId);
            const teamMemberPhoto = await uploadTeamPhoto(req, res, 'image/png', 'image/jpeg', 5000000); //max size 10000kb == 10Mb
            console.log(donationopp)

            donationopp.teamMember1.picture = teamMemberPhoto;
            await donationopp.save();
            console.log(donationopp.teamMember1.picture);
            return res.status(200).json({
                status: 'success'
            });

        } catch (err) {
            console.log(err)
        }
    },

    uploadTeamMember2: async(req, res) => {
        try {
            const { pitchId } = req.params;
            const donationopp = await donatees.findById(pitchId);
            const teamMemberPhoto = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 5000000); //max size 20000kb == 20Mb
            donationopp.teamMember2.picture = teamMemberPhoto;
            await donationopp.save();
            return res.status(200).json({
                status: 'success'
            });

        } catch (err) {
            console.log(err)
        }
    },

    uploadTeamMember3: async(req, res) => {
        try {
            const { pitchId } = req.params;
            const donationopp = await donatees.findById(pitchId);
            const teamMemberPhoto = await uploadPhoto(req, res, 'image/png', 'image/jpeg', 5000000); //max size 20000kb == 20Mb
            donationopp.teamMember3.picture = teamMemberPhoto;
            await donationopp.save();
            return res.status(200).json({
                status: 'success'
            });

        } catch (err) {
            console.log(err)
        }
    }




}