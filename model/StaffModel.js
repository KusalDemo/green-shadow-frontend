export class StaffModel{
    constructor(staffId,
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
                ){
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.designation = designation;
        this.gender = gender;
        this.joinedDate = joinedDate;
        this.dob = dob;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.addressLine3 = addressLine3;
        this.addressLine4 = addressLine4;
        this.addressLine5 = addressLine5;
        this.contactNumber = contactNumber;
        this.email = email;
        this.role = role;
        this.logCode = logCode;
    }

    getStaffId() {
        return this.staffId;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getDesignation() {
        return this.designation;
    }

    getGender() {
        return this.gender;
    }

    getJoinedDate() {
        return this.joinedDate;
    }

    getDOB() {
        return this.dob;
    }

    getAddressLine1() {
        return this.addressLine1;
    }

    getAddressLine2() {
        return this.addressLine2;
    }

    getAddressLine3() {
        return this.addressLine3;
    }

    getAddressLine4() {
        return this.addressLine4;
    }

    getAddressLine5() {
        return this.addressLine5;
    }

    getContactNumber() {
        return this.contactNumber;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return this.role;
    }

    getLogCode() {
        return this.logCode;
    }

    setStaffId(staffId) {
        this.staffId = staffId;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    setDesignation(designation) {
        this.designation = designation;
    }

    setGender(gender) {
        this.gender = gender;
    }

    setJoinedDate(joinedDate) {
        this.joinedDate = joinedDate;
    }

    setDOB(dOB) {
        this.dob = dob;
    }

    setAddressLine1(addressLine1) {
        this.addressLine1 = addressLine1;
    }

    setAddressLine2(addressLine2) {
        this.addressLine2 = addressLine2;
    }

    setAddressLine3(addressLine3) {
        this.addressLine3 = addressLine3;
    }

    setAddressLine4(addressLine4) {
        this.addressLine4 = addressLine4;
    }

    setAddressLine5(addressLine5) {
        this.addressLine5 = addressLine5;
    }

    setContactNumber(contactNumber) {
        this.contactNumber = contactNumber;
    }

    setEmail(email) {
        this.email = email;
    }

    setRole(role) {
        this.role = role;
    }

    setLogCode(logCode) {
        this.logCode = logCode;
    }
}