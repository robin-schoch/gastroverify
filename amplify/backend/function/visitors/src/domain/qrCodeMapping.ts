
export class QrCodeMapping {

    qrId: string;
    ownerId: string;
    locationId: string;
    locationName: string;
    checkIn: boolean;
    type?: string;
    senderID?: string;
    smsText?: string;




    constructor(
        qrId: string,
        ownerId: string,
        locationId: string,
        locationName: string,
        checkIn: boolean,
        type?: string,
        senderID?: string,
        smsText?: string
    ) {
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
