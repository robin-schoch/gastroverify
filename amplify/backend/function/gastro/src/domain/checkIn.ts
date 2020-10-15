import * as moment from 'moment';


export class CheckIn {
  locationId;
  entryTime;
  firstName;
  lastName;
  email;
  street;
  city;
  zipCode;
  checkIn;
  phoneNumber;
  birthdate;
  firstUse;
  tableNumber;
  type;
  ttl;

  public static fromReq(req) {
    return new CheckIn(
        req.params.locationId,
        req.body.firstName,
        req.body.surName,
        !!req.body.email ? req.body.email : 'no email',
        req.body.address,
        req.body.city,
        req.body.zipcode,
        true,
        moment().toISOString(),
        req.body.phone,
        req.body.birthdate,
        false,
    );

  }

  constructor(
      locationId,
      firstName,
      surName,
      email,
      address,
      city,
      zipcode,
      checkIn,
      timestamp,
      phonenumber,
      birthdate,
      firstUse,
      tableNumber = -1,
      type = 'Tisch'
  ) {
    this.locationId = locationId;
    this.entryTime = timestamp;
    this.firstName = firstName;
    this.lastName = surName;
    this.email = email;
    this.street = address;
    this.city = city;
    this.zipCode = zipcode;
    this.checkIn = checkIn;
    this.phoneNumber = phonenumber;
    this.birthdate = birthdate;
    this.firstUse = firstUse;
    this.tableNumber = tableNumber;
    this.type = type;
    this.ttl = moment().add(14, 'days').unix();
  }
}

/*
 patrtionkey = phone and sortkey = time
 */
// checkin
