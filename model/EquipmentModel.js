export class EquipmentModel {
    constructor(
        equipmentId,
        name,
        type,
        status,
        staffId,
        fieldCode
    ) {
        this.equipmentId = equipmentId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.staffId = staffId;
        this.fieldCode = fieldCode;
    }

    getEquipmentId() {
        return this.equipmentId;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getStatus() {
        return this.status;
    }

    getStaffId() {
        return this.staffId;
    }

    getFieldCode() {
        return this.fieldCode;
    }

    setEquipmentId(equipmentId) {
        this.equipmentId = equipmentId;
    }

    setName(name) {
        this.name = name;
    }

    setType(type) {
        this.type = type;
    }

    setStatus(status) {
        this.status = status;
    }

    setStaffId(staffId) {
        this.staffId = staffId;
    }

    setFieldCode(fieldCode) {
        this.fieldCode = fieldCode;
    }
}