document.addEventListener("DOMContentLoaded", () => {
    console.log("Staff loaded");
    const jwtToken = getCookie("token");
    console.log("JWTToken: ", `Bearer ${jwtToken}`);
loadAllLogs(jwtToken)
})

const loadAllLogs = (jwtToken) => {
    let logSelectorInStaff = document.getElementById("staff-log-select");
    if (!logSelectorInStaff) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/log",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach(({logCode, logDetails}) => {
                let option = document.createElement("option");
                option.value = logCode;
                option.text = logDetails;
                logSelectorInStaff.appendChild(option);
            });
        },
        error: (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    });
}


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};