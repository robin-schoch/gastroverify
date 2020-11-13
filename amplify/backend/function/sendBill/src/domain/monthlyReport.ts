export class MonthlyReport {
    billingDate: string;
    complete: boolean;
    paidAt: string;
    partnerId: string;
    price: number;
    from: string;
    to: string;
    distinctTotal: number;
    total: number;


    constructor(
        billingDate: string,
        complete: boolean,
        paidAt: string,
        partnerId: string,
        price: number,
        from: string,
        to: string,
        distinctTotal: number,
        total: number
    ) {
        this.billingDate = billingDate;
        this.complete = complete;
        this.paidAt = paidAt;
        this.partnerId = partnerId;
        this.price = price;
        this.from = from;
        this.to = to;
        this.distinctTotal = distinctTotal;
        this.total = total;
    }
}
