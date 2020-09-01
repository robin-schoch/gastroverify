import {Injectable} from '@angular/core';
import {Page} from '../entry-browser/entry.service';
import {Partner} from '../gastro-dashboard/gastro.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import API from '@aws-amplify/api';
import {Report} from '../report/report.service';
import {Bill} from '../bill/bill.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private _partners$: BehaviorSubject<Page<Partner>> = new BehaviorSubject(null);

    private _bill$: BehaviorSubject<Page<Bill>> = new BehaviorSubject<Page<Bill>>(null);



    private _reports$: BehaviorSubject<Page<Report>> = new BehaviorSubject<Page<Report>>(null);
    apiName = 'verifyGateway';

    constructor() { }

    public loadPartners(page: Page<Partner> = null) {
        const sub = new Subject();

        const init = {};

        if (!!page) {
            console.log(page.LastEvaluatedKey);
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: page.Limit,
                LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey)
            };
        } else {
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: 100,
            };
        }

        API.get(
            this.apiName,
            '/v1/admin/partner',
            init
        ).then(page => {
            this.mergePartners(page);
            sub.next('done');
            sub.complete();
        });
        return sub.asObservable();
    }


    public loadBills(partenrId: string) {
        const sub = new Subject();
        const init = {
        }

        API.get(
            this.apiName,
            '/v1/admin/partner/' + partenrId + '/bill',
            init
        ).then(page => {
            this._bill$.next(page)
            sub.next('done')
            sub.complete()
        })
        return sub.asObservable()
    }

    public loadReports(locationId: string, partnerId: string,  date,  page: Page<Report> = null) {
        const sub = new Subject();

        const iso = date.toISOString()
        const init = {};

        if (!!page) {
            console.log(page.LastEvaluatedKey);
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: page.Limit,
                LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey),
                date: iso
            };
        } else {
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: 100,
                date: iso
            };
        }

        API.get(
            this.apiName,
            '/v1/admin/partner/' + partnerId + '/report/' + locationId,
            init
        ).then(page => {
            this.mergeReports(page);
            sub.next('done');
            sub.complete();
        });
        return sub.asObservable();
    }

    private mergePartners(page: Page<Partner>) {
        const old = this.partners;
        if (!old) {
            this.partners = page;
        } else {
            page.Data = [
                ...old.Data,
                ...page.Data
            ];
            this.partners = page;
        }

    }
    private mergeReports(page: Page<Report>) {
        console.log(page)
        const old = this.reports;
        if (!false) {
            this.reports = page;
        } else {
            page.Data = [
                ...old.Data,
                ...page.Data
            ];
            this.reports = page;
        }

    }




    get partners$(): Observable<Page<Partner>> {
        return this._partners$.asObservable();
    }



    get bills$(): Observable<Page<Bill>> {
        return this._bill$.asObservable();
    }

    set partners(partnerPage: Page<Partner>) {
        this._partners$.next(partnerPage);
    }

    get partners(): Page<Partner> {
        return this._partners$.value;
    }
    get reports$(): Observable<Page<Report>> {
        return this._reports$.asObservable();
    }

    set reports(reportPage: Page<Report>) {
        this._reports$.next(reportPage);
    }

    get reports(): Page<Report> {
        return this._reports$.value;
    }
}
