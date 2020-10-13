import {Location} from './Location';

export interface Partner {
  contactEmail: string,
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
