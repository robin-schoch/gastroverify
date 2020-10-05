import * as moment from 'moment';
import * as crypto from 'crypto';

export class Bill {
  reference;
  partnerId;
  from;
  billingDate;
  to;
  complete;
  paidAt;
  total;
  distinctTotal;
  price;
  customer;
  locations;
  detail;

  constructor(
      partnerId,
      from,
      to,
      complete,
      paidAt,
      total,
      distinctTotal,
      price,
      customer,
      locations,
      detail
  ) {
    this.reference = crypto.createHash('sha1').update(moment(to).toISOString() + partnerId).digest('hex').substring(0, 10);
    this.partnerId = partnerId;
    this.billingDate = to;
    this.from = from;
    this.to = to;
    this.complete = complete;
    this.paidAt = paidAt;
    this.total = total;
    this.distinctTotal = distinctTotal;
    this.price = price;
    this.customer = customer;
    this.locations = locations;
    this.detail = detail;

  }

}

export const billBuilder = (partnerId, from, to, total, distinct, price, customer, locations, detail) => {
  return new Bill(
      partnerId,
      from,
      to,
      false,
      '',
      total,
      distinct,
      price,
      customer,
      locations,
      detail
  );
};

