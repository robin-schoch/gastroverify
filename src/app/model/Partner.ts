import {Location} from './Location';

export interface Partner {
  email: string,

  firstName: string,
  lastName: string,
  address: string,
  city: string
  zipcode: string,
  organisation: string,
  isHidden: boolean
  referral?: number
  locations: Location[],
  bills: any[],
}
