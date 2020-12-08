//Use FORMDATA to upload file
const profileID = document.querySelector('._pid').value
console.log(profileID)

document.getElementById('upload').addEventListener('click', async function(event) {
    document.getElementById('upload').innerHTML = 'Uploading photo . . .'

    const form = document.getElementById('uploadForm');
    const [fileData] = form.querySelectorAll('#fileInput')

    const getFormData = function(fileData) {

        const fileUploadData = new FormData();
        fileUploadData.append('photo', fileData);

        return fileUploadData;
    };


    const postToProfile = async(userData) => {
        const profileUrl = `/my-profile/${profileID}/upload`;

        try {
            const {
                data
            } = await axios({
                method: 'POST',
                url: profileUrl,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                data: userData,
            });

            return data;
        } catch (e) {
            return e.response.data;
        }
    };

    const getData = await getFormData(fileData.files[0]);
    // console.log(getData);

    const response = await postToProfile(getData);
    // console.log(response);

    const redirect = () => {
        window.location.href = `/my-profile/${profileID}/`;
    };

    if (response.status === 'success') {
        alert("Successfully uploaded Logo");
        redirect();
    } else {
        document.getElementById('uploadheaderBtn').value = 'Upload';
        alert(response.message);
        removeToaster(3000);
    }


});