// var companyCountry = document.getElementById("companyCountry")
// if (companyCountry.value != null) {
//     companyCountry.value = "<%=data.companyCountry%>"
// }

/*Disable right-clicking on page*/
//document.addEventListener('contextmenu', event => event.preventDefault());
//Disable right-clicking on page

let editText = document.querySelector('.edit-text')
const editPhoto = document.querySelector('.edit-photo');
$(editPhoto).mouseover(function() {
    editText.style.color = "#91BE32"
    editText.display = "block"
}).mouseout(function() {
    editText.display = "none"
    editText.style.color = "white"
})

const pitchId = document.getElementById("tixdt").value

document.getElementById('uploadBtn').addEventListener('click', async function(event) {
    document.getElementById('uploadBtn').value = 'Uploading . . .'
    const form = document.getElementById('uploadForm');
    const [fileData] = form.querySelectorAll('input');
    const getFormData = (fileData) => {

        const fileUploadData = new FormData();
        fileUploadData.append('photo', fileData);

        return fileUploadData;
    };
    const createPost = async(userData) => {
        const profileUrl = `/donation-opportunities/${pitchId}/upload`;

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
    console.log(getData);
    const response = await createPost(getData);
    // console.log(response);
    const redirect = () => {
        window.location.href = `/donation-opportunities/pitches/${pitchId}/details/edit/dashboard`;
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

//Company Header
document.getElementById('uploadheaderBtn').addEventListener('click', async function(event) {
    document.getElementById('uploadheaderBtn').value = 'Uploading . . .'
    const form = document.getElementById('uploadheaderForm');
    const [fileData] = form.querySelectorAll('input');
    const getFormData = (fileData) => {

        const fileUploadData = new FormData();
        fileUploadData.append('photo', fileData);

        return fileUploadData;
    };
    const createPost = async(userData) => {
        const pitchUrl = `/donation-opportunities/${pitchId}/upload-header`;

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
    console.log(getData);
    const response = await createPost(getData);
    // console.log(response);
    const redirect = () => {
        window.location.href = `/donation-opportunities/pitches/${pitchId}/details/edit/dashboard`;
    };
    if (response.status === 'success') {
        alert("Successfully uploaded header Logo");
        redirect();
    } else {
        document.getElementById('uploadheaderBtn').value = 'Upload';
        alert(response.message);
        removeToaster(3000);
    }
});



