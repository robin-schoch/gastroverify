import {Partner} from '../../model/Partner';

export interface PartnerState {
  partner: Partner,
  error: any,
  loading: boolean
}

export const initialState = {
  partner: {
    contactEmail: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipcode: '',
    organisation: '',
    isHidden: true,
    locations: [],
    bills: [],
  },
  error: null,
  loading: false
};
