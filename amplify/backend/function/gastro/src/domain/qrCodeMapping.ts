import {Location} from './partner';

export class QrCodeMapping {

    qrId: string;
    ownerId: string;
    locationId: string;
    locationName: string;
    checkIn: boolean;
    senderID?: string;
    smsText?: string;

    public static fromLocation(location: Location, email: string, checkIn: boolean): QrCodeMapping {
        return new QrCodeMapping(
            checkIn ? location.checkInCode : location.checkOutCode,
            email,
            location.locationId,
            location.name,
            checkIn,
            location.senderID,
            location.smsText
        );

    }


    constructor(
        qrId: string,
        ownerId: string,
        locationId: string,
        locationName: string,
        checkIn: boolean,
        senderID?: string,
        smsText?: string
    ) {
        this.qrId = qrId;
        this.ownerId = ownerId;
        this.locationId = locationId;
        this.locationName = locationName;
        this.checkIn = checkIn;
        this.senderID = senderID;
        this.smsText = smsText;
    }
}
