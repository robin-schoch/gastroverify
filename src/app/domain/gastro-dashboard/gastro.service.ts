import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import API from '@aws-amplify/api';
import {AuthenticationService} from '../auth/authentication.service';

export interface Partner {
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string
    zipcode: string,
    locations: Location[]
    bills: any[]
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
    senderID: string,
    smsText: string
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
        private authService: AuthenticationService
    ) { }

    public set loaded (loaded: boolean){
        this._loaded = loaded
    }
    public get gastro$(): Observable<Partner> {
        return this._gastro$.asObservable();
    }

    public set gastro(gastro: Partner) {
        console.log(gastro)
        this._gastro$.next(gastro);
    }

    public get error$(): any {
        return this._error$.asObservable();
    }

    public clearPartner () {
        this._gastro$ = new BehaviorSubject<Partner>(null);
    }

    createGatro(partner: Partner) {
        console.log(partner);


        let body = Object.assign(
            {},
            this.myInit
        );
        body['body'] = partner;
        API.post(
            this.apiName,
            '/v1/gastro',
            body
        ).then(elem => {
            this._gastro$.next(elem);

        }).catch(elem => {
            this._error$.next(elem);
            console.log(elem);
        });
    }

    getGastro() {
        if (!this._loaded) {
            API.get(
                this.apiName,
                '/v1/gastro/me',
                this.myInit
            ).then(elem => {
                this._gastro$.next(elem);
                this._loaded = true;
            }).catch(error => {
                console.log(error);
                this._gastro$.next(<Partner>{});
            });
        }

    }

    addBar(bar: Location) {

        let body = Object.assign(
            {},
            this.myInit
        );
        body['body'] = bar;
        console.log(body);
        return API.post(
            this.apiName,
            '/v1/gastro/me/bar',
            body
        );
    }

    removeBar(location: Location) {
        return API.del(
            this.apiName,
            '/v1/gastro/me/bar/' + location.locationId,
            this.myInit
        );
    }
}
