import {v4} from 'uuid';

export class Partner {

  public email: string;
  public contactEmail: string;
  public firstName: string;
  public lastName: string;
  public address;
  public city;
  public zipcode;
  public organisation?;
  public isHidden?: boolean;
  public referral?: number;
  public locations?: Location[];
  public bills?;


  public static fromRequest(req: any): Partner {
    return new Partner(
        req.xUser.email,
        req.xUser.email,
        req.body.firstName,
        req.body.lastName,
        req.body.address,
        req.body.city,
        req.body.zipcode,
        !!req.body.organisation ? req.body.organisation : 'default'
    );
  }

  constructor(
      email,
      contactEmail,
      firstName,
      lastName,
      address,
      city,
      zipcode,
      organisation,
      locations = [],
      bills = [],
      isHidden = false,
      referral = 0
  ) {
    this.email = email;
    this.contactEmail = contactEmail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.zipcode = zipcode;
    this.organisation = organisation;
    this.locations = locations;
    this.bills = bills;
    this.isHidden = isHidden;
    this.referral = referral;
  }
}

export class Location {

  public partnerId;
  public locationId;
  public name;
  public street;
  public city;
  public zipcode;
  public checkOutCode;
  public checkInCode;
  public active;
  public payment;
  public type;
  public senderID;
  public smsText;
  public timeToLive?: number;

  public static fromRequest(req): Location {
    return new Location(
        req.xUser.email,
        v4(),
        req.body.name,
        req.body.street,
        req.body.city,
        req.body.zipcode,
        v4(),
        v4(),
        true,
        !req.body.senderID ? 'default' : 'premium',
        !!req.body.type ? req.body.type : 'Tisch',
        req.body.senderID,
        req.body.smsText
    );
  }

  public constructor(
      partnerId,
      locationId,
      name,
      street,
      city,
      zipcode,
      checkOutCode,
      checkInCode,
      active,
      payment,
      type,
      senderID,
      smsText
  ) {
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

}
