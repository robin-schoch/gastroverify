import {Location} from './Location';

export interface Partner {
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  city: string
  zipcode: string,
  locations: Location[],
  bills: any[],
  isHidden: boolean
  referral?: number
}
