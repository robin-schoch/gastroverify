import * as moment from 'moment';
import * as crypto from 'crypto';
import {Partner} from './partner';

export class Bill {
  reference: string;
  partnerId: string;
  from: string;
  billingDate: string;
  to: string;
  complete: boolean;
  paidAt: string;
  total: number;
  distinctTotal: number;
  price: number;
  finalizedPrice: number;
  customer: any;
  locations: any;
  detail: any;
  discount: number;

  constructor(
      billNumber,
      partnerId,
      from,
      to,
      complete,
      paidAt,
      total,
      distinctTotal,
      price,
      finalizedPrice,
      customer,
      locations,
      detail,
      discount
  ) {
    this.reference = billNumber;
    this.partnerId = partnerId;
    this.billingDate = to;
    this.from = from;
    this.to = to;
    this.complete = complete;
    this.paidAt = paidAt;
    this.total = total;
    this.distinctTotal = distinctTotal;
    this.price = price;
    this.finalizedPrice = finalizedPrice;
    this.customer = customer;
    this.locations = locations;
    this.detail = detail;
    this.discount = discount;

  }

}

export const billBuilder = (billNumber:string, from, to, billInfo, customer: Partner, reports, discount = 0) => {
  return new Bill(
      billNumber,
      customer.email,
      from,
      to,
      false,
      '',
      billInfo.total,
      billInfo.distinctTotal,
      billInfo.price,
      billInfo.finalPrice,
      customer,
      reports.map((report: any) => report.res),
      reports.map((reports: any) => Object.assign({}, reports.res, {
        detail: reports.original.map(det => {
          return {
            reportDate: det.reportDate,
            distinctTotal: det.distinctTotal,
            price: det.distinctTotal * det.pricePerEntry
          };
        })
      })),
      discount
  );
};

