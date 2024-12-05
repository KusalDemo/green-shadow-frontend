import {StaffModel} from "../model/StaffModel.js";
import {getCookie, showErrorAlert, destroyDataTable, getFormattedDate} from "../utils/utils.js";
import {isAtLeast18YearsOld, isValidEmail, isValidSriLankanPhoneNumber} from "../utils/validations.js";

document.addEventListener("DOMContentLoaded", () => {
    const jwtToken = getCookie("token");
    loadStaffTable(jwtToken);

    const btnNavigateToStaff = document.getElementById("nav-staff");
    if (btnNavigateToStaff) {
        btnNavigateToStaff.addEventListener('click', () => {
            loadAllLogs(jwtToken)
            loadStaffIds(jwtToken)
            loadFieldCodes(jwtToken)
        });
    }

    const staffSaveButton = document.getElementById("staff-save-btn");
    if (staffSaveButton) {
        staffSaveButton.addEventListener('click', () => saveStaff(jwtToken));
    }

    const staffUpdateButton = document.getElementById("staff-update-btn");
    if (staffUpdateButton) {
        staffUpdateButton.addEventListener('click', () => updateStaff(jwtToken));
    }

    const staffClearButton = document.getElementById("staff-clear-btn");
    if (staffClearButton) {
        staffClearButton.addEventListener('click', () => clearTable());
    }

    const btnAssignStaffToField = document.getElementById("btn-assign-staff-to-field");
    if (btnAssignStaffToField) {
        btnAssignStaffToField.addEventListener('click', () => assignStaffToField(jwtToken));
    }

    const btnReleaseStaffFromField = document.getElementById("btn-release-staff-from-field");
    if (btnReleaseStaffFromField) {
        btnReleaseStaffFromField.addEventListener('click', () => releaseStaffFromField(jwtToken));
    }
})

const loadStaffTable = (jwtToken) => {
    let staffTable = document.getElementById("staff-table-body");
    if (!staffTable) return;

    destroyDataTable('#staff-table');

    $.ajax({
        url: "http://localhost:8082/api/v1/staff",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            document.getElementById("staff-count").innerHTML = data.length+' +';
            staffTable.innerHTML = "";
            data.forEach((staff, index) => {
                const {
                    id,
                    firstName,
                    lastName,
                    designation,
                    gender,
                    joinedDate,
                    dob,
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
                    <td>${getFormattedDate(joinedDate)}</td>
                    <td>${getFormattedDate(dob)}</td>
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
            new DataTable("#staff-table", {paging: true, pageLength: 10, destroy: true});
        },
        error: (error) => showErrorAlert(error)
    });
}

const loadAllLogs = (jwtToken) => {
    let logSelectorInStaff = document.getElementById("staff-log-select");
    if (!logSelectorInStaff) return;

    logSelectorInStaff.innerHTML = "";

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
        }
    });
}

const saveStaff = async (jwtToken) => {
    if(document.getElementById("staff-id").innerText===""){
        let staffToSave = await getValuesInStaffForm();

        if(!isAtLeast18YearsOld(staffToSave.dob)){
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Staff should be atleast 18 years old',
            });
            return;
        }
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
                    loadStaffTable(jwtToken);
                    clearTable();
                    loadStaffIds(jwtToken);
                },
                error: (error) => showErrorAlert(error)
            });
        }catch (error) {
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
    if(!isAtLeast18YearsOld(staffToUpdate.dob)){
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Staff should be atleast 18 years old to be added',
        })
        return
    }
    let staffIdToUpdate = document.getElementById("staff-id").innerText;
    if(staffIdToUpdate){
        staffToUpdate.id = staffIdToUpdate;
        try{
            $.ajax({
                url: "http://localhost:8082/api/v1/staff/"+staffIdToUpdate,
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(staffToUpdate),
                contentType: "application/json",
                success:async () => {
                    await loadStaffTable(jwtToken);
                    Swal.fire({
                        icon: 'success',
                        title: 'Staff updated successfully',
                        text: 'Staff updated successfully',
                    })
                    clearTable();
                    loadStaffIds(jwtToken);
                },
                error: (error) => showErrorAlert(error)
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

const loadStaffIds = (jwtToken) => {
    const staffSelector = document.getElementById("staff-select-1");
    if (!staffSelector) return;

    staffSelector.innerHTML = "";

    $.ajax({
      url: "http://localhost:8082/api/v1/staff",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`
      },
      success: (data) => {
        data.forEach(({ id, firstName, lastName, designation }) => {
          let option = document.createElement("option");
          option.value = id;
          option.text = firstName + " " + lastName + " - " + designation;
          staffSelector.appendChild(option);
        });
      },
      error: (error) => showErrorAlert(error)
    })
}

const loadFieldCodes = (jwtToken) => {
    const fieldSelector = document.getElementById("field-select-1");
    if (!fieldSelector) return;

    fieldSelector.innerHTML = "";

    $.ajax({
      url: "http://localhost:8082/api/v1/field",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`
      },
      success: (data) => {
        data.forEach(({ fieldCode, fieldName }) => {
          let option = document.createElement("option");
          option.value = fieldCode;
          option.text = fieldName;
          fieldSelector.appendChild(option);
        });
      },
      error: (error) => showErrorAlert(error)
    })
}

const assignStaffToField = (jwtToken) => {
    const selectedStaff = document.getElementById("staff-select-1").value;
    const selectedField = document.getElementById("field-select-1").value;
    if (!selectedStaff || !selectedField) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select both staff and field',
        })
    }

    const formData = new FormData();
    formData.append("staffId", selectedStaff);
    formData.append("fieldCode", selectedField);

    $.ajax({
        url: "http://localhost:8082/api/v1/staff",
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Staff assigned to field successfully!',
            })
            loadStaffTable(jwtToken);
        },
        error: (error) => showErrorAlert(error)
    })
}

const releaseStaffFromField = (jwtToken) => {
    const selectedStaff = document.getElementById("staff-select-1").value;
    const selectedField = document.getElementById("field-select-1").value;
    if (!selectedStaff || !selectedField) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select both staff and field',
        })
        return
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Staff will be released from field",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#0D9F4F',
        confirmButtonText: 'Yes, Release!'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append("staffId", selectedStaff);
            formData.append("fieldCode", selectedField);

            $.ajax({
                url: "http://localhost:8082/api/v1/staff",
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: formData,
                processData: false,
                contentType: false,
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Staff released from field successfully!',
                    })
                    loadStaffTable(jwtToken);
                },
                error: (error) => showErrorAlert(error)
            })
        }
    })
}

const updateFormFields = (staff) => {
    document.getElementById("staff-id").innerText = staff.id || "";
    document.getElementById("first-name-input").value = staff.firstName || "";
    document.getElementById("last-name-input").value = staff.lastName || "";
    document.getElementById("designation-select").value = staff.designation || "";
    document.getElementById("gender-select").value = staff.gender || "";
    document.getElementById("joined-date-input").value = staff.joinedDate || "";
    document.getElementById("dob-input").value = staff.dob || "";
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

    if (!fName || !lName || !designation || !gender || !joinedDate || !dob || !addressLine1 || !contact || !email || !role || !log) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please fill all the fields!',
        })
        return;
    }
    if(!isValidSriLankanPhoneNumber(contact)){
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a valid sri lankan phone number!, example: 077XXXXXXX, 011XXXXXXX',
        })
        return;
    }
    if(!isValidEmail(email)){
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a valid email address!',
        })
        return;
    }

    const staffInForm = new StaffModel();
    staffInForm.firstName = fName;
    staffInForm.lastName = lName;
    staffInForm.designation = designation;
    staffInForm.gender = gender;
    staffInForm.joinedDate = joinedDate;
    staffInForm.dob = dob;
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

const clearTable = () => {
    document.getElementById("staff-id").innerText = "";
    document.getElementById("first-name-input").value = "";
    document.getElementById("last-name-input").value = "";
    document.getElementById("designation-select").value = "";
    document.getElementById("gender-select").value = "";
    document.getElementById("joined-date-input").value = "";
    document.getElementById("dob-input").value = "";
    document.getElementById("address-line-1-input").value = "";
    document.getElementById("address-line-2-input").value = "";
    document.getElementById("address-line-3-input").value = "";
    document.getElementById("address-line-4-input").value = "";
    document.getElementById("address-line-5-input").value = "";
    document.getElementById("contact-input").value = "";
    document.getElementById("email-input").value = "";
    document.getElementById("staff-role-select").value = "";
    document.getElementById("staff-log-select").value = "";
}
