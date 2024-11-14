export class VehicleModel {
    constructor(
        vehicleCode,
        licensePlateNumber,
        vehicleCategory,
        fuelType,
        status,
        remarks,
        staff
    ) {
        this.vehicleCode = vehicleCode;
        this.licensePlateNumber = licensePlateNumber;
        this.vehicleCategory = vehicleCategory;
        this.fuelType = fuelType;
        this.status = status;
        this.remarks = remarks;
        this.staff = staff;
    }

    getVehicleCode() {
        return this.vehicleCode;
    }

    getLicensePlateNumber() {
        return this.licensePlateNumber;
    }

    getVehicleCategory() {
        return this.vehicleCategory;
    }

    getFuelType() {
        return this.fuelType;
    }

    getStatus() {
        return this.status;
    }

    getRemarks() {
        return this.remarks;
    }

    getStaff() {
        return this.staff;
    }

    setVehicleCode(vehicleCode) {
        this.vehicleCode = vehicleCode;
    }

    setLicensePlateNumber(licensePlateNumber) {
        this.licensePlateNumber = licensePlateNumber;
    }

    setVehicleCategory(vehicleCategory) {
        this.vehicleCategory = vehicleCategory;
    }

    setFuelType(fuelType) {
        this.fuelType = fuelType;
    }

    setStatus(status) {
        this.status = status;
    }

    setRemarks(remarks) {
        this.remarks = remarks;
    }

    setStaff(staff) {
        this.staff = staff;
    }
}