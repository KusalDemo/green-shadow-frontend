import {StaffModel} from "../model/StaffModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Staff loaded");
    const jwtToken = getCookie("token");
    console.log("JWTToken: ", `Bearer ${jwtToken}`);
    loadAllLogs(jwtToken)
    loadTable(jwtToken);

    const staffSaveButton = document.getElementById("staff-save-btn");
    if (staffSaveButton) {
        staffSaveButton.addEventListener('click', () => saveStaff(jwtToken));
    }

    const staffUpdateButton = document.getElementById("staff-update-btn");
    if (staffUpdateButton) {
        staffUpdateButton.addEventListener('click', () => updateStaff(jwtToken));
    }
})

const loadTable = (jwtToken) => {
    let staffTable = document.getElementById("staff-table-body");
    if (!staffTable) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/staff",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            staffTable.innerHTML = "";
            data.forEach((staff, index) => {
                const {
                    id,
                    firstName,
                    lastName,
                    designation,
                    gender,
                    joinedDate,
                    dOB,
                    addressLine1,
                    addressLine2,
                    addressLine3,
                    addressLine4,
                    addressLine5,
                    contactNumber,
                    email,
                    role,
                    logCode
                } = staff;

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${firstName}</td>
                    <td>${lastName}</td>
                    <td>${designation}</td>
                    <td>${gender}</td>
                    <td>${joinedDate}</td>
                    <td>${dOB}</td>
                    <td>${addressLine1}</td>
                    <td>${addressLine2}</td>
                    <td>${addressLine3}</td>
                    <td>${addressLine4}</td>
                    <td>${addressLine5}</td>
                    <td>${contactNumber}</td>
                    <td>${email}</td>
                    <td>${role}</td>
                    <td>${logCode}</td>
                `;

                row.addEventListener("click", () => updateFormFields(staff));

                staffTable.appendChild(row);
            });

            new DataTable("#staff-table", {
                paging: true,
                pageLength: 10,
                destroy: true
            });
        },
        error: (error) => {
            let err = JSON.stringify(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! ' + err
            });
        }
    });
}

const loadAllLogs = (jwtToken) => {
    console.log("All Logs Loaded")
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

const saveStaff = async (jwtToken) => {
    if(document.getElementById("staff-id")==null){
        let staffToSave = await getValuesInStaffForm();
        console.log(staffToSave)

        try{
            $.ajax({
                url: "http://localhost:8082/api/v1/staff",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(staffToSave),
                contentType: "application/json",
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Staff added successfully',
                        text: 'Staff added successfully',
                    })
                    loadTable(jwtToken);
                },
                error: (error) => {
                    let err = JSON.stringify(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!' + err,
                    });
                }
            });
        }catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again',
            });
        }
    }else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'It seems you have an existing staff. Please update it instead',
        });
    }
}

const updateStaff = async (jwtToken) => {
    let staffToUpdate = await getValuesInStaffForm();
    let staffIdToUpdate = document.getElementById("staff-id").innerText;
    if(staffIdToUpdate){
        staffToUpdate.id = staffIdToUpdate;
        console.log(staffIdToUpdate)
        try{
            $.ajax({
                url: "http://localhost:8082/api/v1/staff/"+staffIdToUpdate,
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(staffToUpdate),
                contentType: "application/json",
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Staff updated successfully',
                        text: 'Staff updated successfully',
                    })
                    loadTable(jwtToken);
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
            });
        }catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again',
            });
        }
    }else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'It seems you have not an existing staff. Please add it instead',
        });
    }

}












const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const updateFormFields = (staff) => {
    document.getElementById("staff-id").innerText = staff.id || "";
    document.getElementById("first-name-input").value = staff.firstName || "";
    document.getElementById("last-name-input").value = staff.lastName || "";
    document.getElementById("designation-select").value = staff.designation || "";
    document.getElementById("gender-select").value = staff.gender || "";
    document.getElementById("joined-date-input").value = staff.joinedDate || "";
    document.getElementById("dob-input").value = staff.dOB || "";
    document.getElementById("address-line-1-input").value = staff.addressLine1 || "";
    document.getElementById("address-line-2-input").value = staff.addressLine2 || "";
    document.getElementById("address-line-3-input").value = staff.addressLine3 || "";
    document.getElementById("address-line-4-input").value = staff.addressLine4 || "";
    document.getElementById("address-line-5-input").value = staff.addressLine5 || "";
    document.getElementById("contact-input").value = staff.contactNumber || "";
    document.getElementById("email-input").value = staff.email || "";
    document.getElementById("staff-role-select").value = staff.role || "";
    document.getElementById("staff-log-select").value = staff.logCode || "";
};

const getValuesInStaffForm =  () => {
    let fName = document.getElementById("first-name-input")?.value || "";
    let lName = document.getElementById("last-name-input")?.value || "";
    let designation = document.getElementById("designation-select")?.value || "";
    let gender = document.getElementById("gender-select")?.value || "";
    let joinedDate = document.getElementById("joined-date-input")?.value || "";
    let dob = document.getElementById("dob-input")?.value || "";
    let addressLine1 = document.getElementById("address-line-1-input")?.value || "";
    let addressLine2 = document.getElementById("address-line-2-input")?.value || "";
    let addressLine3 = document.getElementById("address-line-3-input")?.value || "";
    let addressLine4 = document.getElementById("address-line-4-input")?.value || "";
    let addressLine5 = document.getElementById("address-line-5-input")?.value || "";
    let contact = document.getElementById("contact-input")?.value || "";
    let email = document.getElementById("email-input")?.value || "";
    let role = document.getElementById("staff-role-select")?.value || "";
    let log = document.getElementById("staff-log-select")?.value || "";

    const staffInForm = new StaffModel();
    staffInForm.firstName = fName;
    staffInForm.lastName = lName;
    staffInForm.designation = designation;
    staffInForm.gender = gender;
    staffInForm.joinedDate = joinedDate;
    staffInForm.dOB = dob;
    staffInForm.addressLine1 = addressLine1;
    staffInForm.addressLine2 = addressLine2;
    staffInForm.addressLine3 = addressLine3;
    staffInForm.addressLine4 = addressLine4;
    staffInForm.addressLine5 = addressLine5;
    staffInForm.contactNumber = contact;
    staffInForm.email = email;
    staffInForm.role = role;
    staffInForm.logCode = log;

    return staffInForm;
}
