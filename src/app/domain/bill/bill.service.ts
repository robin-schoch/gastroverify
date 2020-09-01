import { Injectable } from '@angular/core';


export interface Bill {
    partnerId: string,
    billingDate: string,
    complete: boolean,
    distinctTotal: number,
    total: number,
    from: number,
    to: number,
    paidAt: string,
    price: number
}
@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor() { }
}
