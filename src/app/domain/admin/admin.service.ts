import {Injectable} from '@angular/core';
import {Page} from '../entry-browser/entry.service';
import {Location} from '../../model/Location';
import {Partner} from '../../model/Partner';
import {BehaviorSubject, Observable} from 'rxjs';
import {Report} from '../report/report.service';
import {Bill} from '../bill/bill.service';
import {AmplifyHttpClientService} from '../../util/amplify-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private _partners$: BehaviorSubject<Page<Partner>> = new BehaviorSubject(null);

  private _bill$: BehaviorSubject<Page<Bill>> = new BehaviorSubject<Page<Bill>>(null);


  private _reports$: BehaviorSubject<Page<Report>> = new BehaviorSubject<Page<Report>>(null);
  apiName = 'verifyGateway';

  constructor(
      private amplifyHttpClient: AmplifyHttpClientService
  ) { }

  public loadPartners(page: Page<Partner> = null): Observable<Page<Partner>> {
    const init = {};
    if (!!page) {
      init['queryStringParameters'] = {  // OPTIONAL
        Limit: page.Limit,
        LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey)
      };
    } else {
      init['queryStringParameters'] = {  // OPTIONAL
        Limit: 100,
      };
    }
    return this.amplifyHttpClient.get<Page<Partner>>(
        this.apiName,
        '/v1/admin/partner',
        init
    );
  }


  public loadBills(partnerId: string) {
    return this.amplifyHttpClient.get<Page<Bill>>(
        this.apiName,
        '/v1/admin/partner/' + partnerId + '/bill'
    );
  }

  public loadLocations(partenrId: string) {
    return this.amplifyHttpClient.get<Page<Location>>(
        this.apiName,
        '/v1/admin/partner/' + partenrId + '/location'
    );

  }

  public loadReports(
      locationId: string,
      partnerId: string,
      date,
      page: Page<Report> = null
  ): Observable<Page<Report>> {
    const iso = date.toISOString();
    const init = {};
    if (!!page) {
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
    return this.amplifyHttpClient.get<Page<Report>>(
        this.apiName,
        '/v1/admin/partner/' + partnerId + '/report/' + locationId,
        init
    );
  }

  public mergePartners(page: Page<Partner>) {
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

  public mergeReports(page: Page<Report>) {
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

  public payBill(bill: Bill, complete: boolean): Observable<any> {
    return this.amplifyHttpClient.put(
        this.apiName,
        '/v1/admin/partner/' + bill.partnerId + '/bill/' + bill.billingDate,
        {
          body: {
            complete: complete
          }
        }
    );
  }

  public hideUser(email: string, hide: boolean) {
    return this.amplifyHttpClient.put(
        this.apiName,
        '/v1/admin/partner/' + email + '/hide',
        {
          queryStringParameters: {
            hide: hide
          }
        }
    );
  }


  get partners$(): Observable<Page<Partner>> {
    return this._partners$.asObservable();
  }


  get bills$(): Observable<Page<Bill>> {
    return this._bill$.asObservable();
  }

  get bills(): Page<Bill> {
    return this._bill$.value;
  }

  set bills(bills: Page<Bill>) {
    this._bill$.next(bills);
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

  updateBill(bill: Bill, attributes: any) {
    const b = this.bills.Data.filter(elem => elem === bill)[0];
    const updatedBill = Object.assign(
        {},
        b,
        attributes.Attributes
    );
    const index = this.bills.Data.indexOf(bill);
    if (index !== -1) {
      this.bills.Data[index] = updatedBill;
    }
    this.bills = JSON.parse(JSON.stringify(this.bills));
  }

  changeReferral(up: boolean, partner: Partner): Observable<any> {
    return this.amplifyHttpClient.put(this.apiName,
        '/v1/admin/partner'+ partner.email + '/hide',
        {
          body: {
            up: up
          }
        });
  }


}
