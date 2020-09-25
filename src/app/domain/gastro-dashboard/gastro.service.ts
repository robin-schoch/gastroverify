import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AuthenticationService} from '../auth/authentication.service';
import {AmplifyHttpClientService} from '../../util/amplify-http-client.service';

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
}

export interface Location {
  locationId: string,
  name: string,
  street: string,
  city: string,
  zipcode: string,
  checkOutCode: string,
  checkInCode: string,
  active: boolean,
  type: string,
  senderID: string,
  smsText: string,
  timeToLive?: number
}


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
      private authService: AuthenticationService,
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
    console.log(gastro.locations);

    this._gastro$.next(gastro);
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
    return this.amplifyHttpClient.post<Partner>(
        this.apiName,
        '/v1/gastro',
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
}
