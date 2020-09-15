export class Entry {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    zipCode: string;
    email: string;
    phoneNumber: string;
    entryTime: string;
    checkIn: boolean;
    birthdate: string;
    tableNumber: number;

    public static exportToHumanReadable(entry: Entry) {
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
            tableNumber: entry.tableNumber === -1 ? 'Kein Tisch' : entry.tableNumber
        };
    }

    constructor(
        firstName: string,
        lastName: string,
        street: string,
        city: string,
        zipCode: string,
        email: string,
        phoneNumber: string,
        entryTime: string,
        checkIn: boolean,
        birthdate: string,
        tableNumber: number
    ) {
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
    }
}
