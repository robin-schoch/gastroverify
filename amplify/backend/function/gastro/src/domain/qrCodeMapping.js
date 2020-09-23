"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeMapping = void 0;
class QrCodeMapping {
    constructor(qrId, ownerId, locationId, locationName, checkIn, senderID, smsText) {
        this.qrId = qrId;
        this.ownerId = ownerId;
        this.locationId = locationId;
        this.locationName = locationName;
        this.checkIn = checkIn;
        this.senderID = senderID;
        this.smsText = smsText;
    }
    static fromLocation(location, email, checkIn) {
        return new QrCodeMapping(checkIn ? location.checkInCode : location.checkOutCode, email, location.locationId, location.name, checkIn, location.senderID, location.smsText);
    }
}
exports.QrCodeMapping = QrCodeMapping;
