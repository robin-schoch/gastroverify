"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.Partner = void 0;
const uuid_1 = require("uuid");
class Partner {
    constructor(email, firstName, lastName, address, city, zipcode, locations = [], bills = [], isHidden = false) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.zipcode = zipcode;
        this.locations = locations;
        this.bills = bills;
        this.isHidden = isHidden;
    }
    static fromRequest(req) {
        return new Partner(req.xUser.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.zipcode);
    }
}
exports.Partner = Partner;
class Location {
    constructor(partnerId, locationId, name, street, city, zipcode, checkOutCode, checkInCode, active, payment, type, senderID, smsText) {
        this.partnerId = partnerId;
        this.locationId = locationId;
        this.name = name;
        this.street = street;
        this.city = city;
        this.zipcode = zipcode;
        this.checkOutCode = checkOutCode;
        this.checkInCode = checkInCode;
        this.active = active;
        this.payment = payment;
        this.type = type;
        this.senderID = senderID;
        this.smsText = smsText;
    }
    static fromRequest(req) {
        return new Location(req.xUser.email, uuid_1.v4(), req.body.name, req.body.street, req.body.city, req.body.zipcode, uuid_1.v4(), uuid_1.v4(), true, !req.body.senderID ? 'default' : 'premium', !!req.body.type ? req.body.type : 'Tisch', req.body.senderID, req.body.smsText);
    }
}
exports.Location = Location;
