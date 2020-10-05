"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
class Entry {
    constructor(firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber, type = 'table') {
        this.firstName = firstName;
        this.lastName = lastName;
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.entryTime = entryTime;
        this.checkIn = checkIn;
        this.birthdate = birthdate;
        this.tableNumber = tableNumber;
        this.type = type;
    }
    static exportToHumanReadable(entry) {
        return {
            firstName: entry.firstName,
            lastName: entry.lastName,
            street: entry.street,
            city: entry.city,
            zipCode: entry.zipCode,
            email: !!entry.email ? entry.email : 'Keine Email',
            phoneNumber: entry.phoneNumber,
            entryTime: entry.entryTime,
            checkIn: entry.checkIn ? 'Standort betreten' : 'Standort verlassen',
            birthdate: entry.birthdate,
            tableNumber: entry.tableNumber === -1 ? 'Keine Angabe' : entry.tableNumber
        };
    }
}
exports.Entry = Entry;
