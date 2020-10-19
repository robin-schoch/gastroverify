export interface Location {
  locationId: string,
  name: string,
  street: string,
  city: string,
  zipcode: string,
  checkOutCode: string,
  checkInCode: string,
  active: boolean,
  type: string,
  senderID: string,
  smsText: string,
  timeToLive?: number
}
