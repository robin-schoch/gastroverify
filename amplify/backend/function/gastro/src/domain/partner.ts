export class Partner {

    public email;
    public firstName;
    public lastName;
    public address;
    public city;
    public zipcode;
    public locations;
    public bills;

    constructor(
        email,
        firstName,
        lastName,
        address,
        city,
        zipcode,
        locations = [],
        bills = [],
    ) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.address = address
        this.city = city
        this.zipcode = zipcode
        this.locations = locations
        this.bills = bills
    }
}

export class Location {

    public locationId;
    public name;
    public street;
    public city;
    public zipcode;
    public checkOutCode;
    public checkInCode;
    public active;
    public payment;
    public senderID;
    public smsText;

    public constructor(
        locationId,
        name,
        street,
        city,
        zipcode,
        checkOutCode,
        checkInCode,
        active,
        payment,
        senderID,
        smsText
    ) {
        this.locationId = locationId
        this.name = name
        this.street = street
        this.city = city
        this.zipcode = zipcode
        this.checkOutCode = checkOutCode
        this.checkInCode = checkInCode

        this.active = active
        this.payment = payment
        this.senderID = senderID
        this.smsText = smsText

    }

}
