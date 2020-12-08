const pitchId = document.getElementById("tixdt").value

async function toUploadTeamPhoto(formId, buttonId, teamMember) {
    //Upload Team Members
    document.getElementById(buttonId).value = 'Uploading . . .'
    const form = document.getElementById(formId);
    const [fileData] = form.querySelectorAll('input');
    const getFormData = (fileData) => {

        const fileUploadData = new FormData();
        fileUploadData.append('photo', fileData);

        return fileUploadData;
    };

    const createPost = async(userData) => {
        const pitchUrl = `/donation-opportunities/pitches/${pitchId}/${teamMember}`;

        try {
            const {
                data
            } = await axios({
                method: 'POST',
                url: pitchUrl,
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
    const response = await createPost(getData);
    // console.log(response);

    const redirect = () => {
        window.location.href = `/donation-opportunities/pitches/${pitchId}/details/edit/dashboard`;
    };

    if (response.status === 'success') {
        redirect();
        alert("Successfully uploaded team member Logo");
        document.getElementById(buttonId).value = 'Upload'
        location.reload();

    } else {
        document.getElementById(buttonId).value = 'Try again';
        alert(response.message);
        removeToaster(3000);
    }
}