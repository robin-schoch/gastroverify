import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AmplifyHttpClientService, IOptionalRequestParams} from '../../util/amplify-http-client.service';
import {Partner} from '../../model/Partner';
import {Location} from '../../model/Location';
import {CheckIn} from '../../model/CheckIn';


@Injectable({
  providedIn: 'root'
})
export class GastroService {

  private _loaded = false;

  private _gastro$: BehaviorSubject<Partner> = new BehaviorSubject<Partner>(null);

  private _error$: Subject<any> = new Subject<any>();

  apiName = 'verifyGateway';
  private myInit = { // OPTIONAL

  };

  constructor(
      private amplifyHttpClient: AmplifyHttpClientService
  ) { }

  public set loaded(loaded: boolean) {
    this._loaded = loaded;
  }

  public get gastro$(): Observable<Partner> {
    return this._gastro$.asObservable();
  }


  public set gastro(gastro: Partner) {
    if (!!gastro) gastro.locations = gastro.locations.sort((l1, l2) => Number(l2.active) - Number(l1.active));

    this._gastro$.next(Object.assign({}, gastro));
  }

  public get gastro(): Partner {

    return this._gastro$.value;
  }

  public get error$(): any {
    return this._error$.asObservable();
  }

  public set error(err: any) {
    this._error$.next(err);
  }

  public clearPartner() {
    this._gastro$ = new BehaviorSubject<Partner>(null);
  }

  public createPartner(partner: Partner): Observable<Partner> {

    let body = Object.assign(
        {},
        this.myInit
    );
    body['body'] = partner;
    return this.amplifyHttpClient.post<Partner>(this.apiName, '/v1/gastro', body);
  }

  public updatePartner(partner: Partner): Observable<Partner> {
    let body = Object.assign(
        {},
        this.myInit
    );
    body['body'] = partner;
    return this.amplifyHttpClient.put<Partner>(
        this.apiName,
        'v1/gastro',
        body
    );
  }

  getPartner(): Observable<Partner> {
    if (!this._loaded) {
      return this.amplifyHttpClient.get<Partner>(
          this.apiName,
          '/v1/gastro/me',
          this.myInit
      );
    }
  }

  addBar(location: Location): Observable<Location> {

    let body = Object.assign(
        {},
        this.myInit
    );
    body['body'] = location;
    return this.amplifyHttpClient.post<Location>(
        this.apiName,
        '/v1/gastro/me/bar',
        body
    );
  }

  removeBar(location: Location): Observable<Location> {
    return this.amplifyHttpClient.delete<Location>(this.apiName, '/v1/gastro/me/bar/' + location.locationId);
  }

  activateLocation(location: Location): Observable<Location> {

    return this.amplifyHttpClient.put(this.apiName, '/v1/gastro/me/bar/' + location.locationId);
  }


  addCustomEntry(location: Location, checkIn: CheckIn) {
    let body = Object.assign(
        {},
        this.myInit
    );
    body['body'] = checkIn;
    return this.amplifyHttpClient.post(this.apiName, '/v1/entry/me/location/' + location.locationId + '/visitor', body);
  }


  getCounter(location: Location, hours: number): Observable<any> {
    let body = <IOptionalRequestParams>{
      queryStringParameters: {
        'hours': hours
      }
    };

    return this.amplifyHttpClient.get(this.apiName, '/v1/entry/me/location/' + location.locationId + '/counter', body);
  }


  addShadowCheckout(location: Location): Observable<any> {
    const param = <CheckIn>{
      checkIn: false,
      address: 'Phantom',
      birthdate: '01.01.1970',
      city: 'Phantom',
      email: 'pahton@email.com',
      firstName: 'phantom',
      phone: '+0000000' + new Date().valueOf(),
      surName: 'phantom',
      zipcode: '0000'
    };
    return this.addCustomEntry(location, param);
  }

}
