"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeMapping = void 0;
class QrCodeMapping {
    constructor(qrId, ownerId, locationId, locationName, checkIn, type, senderID, smsText) {
        this.qrId = qrId;
        this.ownerId = ownerId;
        this.locationId = locationId;
        this.locationName = locationName;
        this.checkIn = checkIn;
        this.type = type;
        this.senderID = senderID;
        this.smsText = smsText;
    }
}
exports.QrCodeMapping = QrCodeMapping;
