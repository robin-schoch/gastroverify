import {Location} from './partner';

export class QrCodeMapping {

  qrId: string;
  ownerId: string;
  locationId: string;
  locationName: string;
  checkIn: boolean;
  relatedCheckOutCode?: string;
  type?: string;
  senderID?: string;
  smsText?: string;

  public static fromLocation(location: Location, email: string, checkIn: boolean): QrCodeMapping {
    const b = new QrCodeMapping(
        checkIn ? location.checkInCode : location.checkOutCode,
        email,
        location.locationId,
        location.name,
        checkIn,
        checkIn ? location.checkOutCode : '',
        location.type,
        location.senderID,
        location.smsText
    );
    console.log(b);
    return b;

  }


  constructor(
      qrId: string,
      ownerId: string,
      locationId: string,
      locationName: string,
      checkIn: boolean,
      relatedCheckOutCode?: string,
      type?: string,
      senderID?: string,
      smsText?: string
  ) {
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
}
