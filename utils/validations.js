export const isAtLeast18YearsOld = (dob) => {
    const inputDate = new Date(dob);
    const today = new Date();

    const minAllowedDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    return inputDate <= minAllowedDate;
};

export const isValidSriLankanNumberPlate = (plate) => {
    const sriLankanNumberPlateRegex = /^(?:[A-Z]{2}|[A-Z]{3}|\d{3})-\d{4}$/;
    return sriLankanNumberPlateRegex.test(plate);
};

export const isValidSriLankanPhoneNumber = (phoneNumber) => {
    const sriLankanPhoneNumberRegex = /^(?:07[0-9]|011|0[1-9][0-9])-?\d{7}$/;
    return sriLankanPhoneNumberRegex.test(phoneNumber);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
};