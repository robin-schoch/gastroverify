"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeMapping = void 0;
class QrCodeMapping {
    constructor(qrId, ownerId, locationId, locationName, checkIn, relatedCheckOutCode, type, senderID, smsText) {
        this.qrId = qrId;
        this.ownerId = ownerId;
        this.locationId = locationId;
        this.locationName = locationName;
        this.checkIn = checkIn;
        this.relatedCheckOutCode = relatedCheckOutCode;
        this.type = type;
        this.senderID = senderID;
        this.smsText = smsText;
    }
    static fromLocation(location, email, checkIn) {
        const b = new QrCodeMapping(checkIn ? location.checkInCode : location.checkOutCode, email, location.locationId, location.name, checkIn, checkIn ? location.checkOutCode : '', location.type, location.senderID, location.smsText);
        console.log(b);
        return b;
    }
}
exports.QrCodeMapping = QrCodeMapping;
