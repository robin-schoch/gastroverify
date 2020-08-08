import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import API from '@aws-amplify/api';
import {AuthenticationService} from '../auth/authentication.service';

export interface Gastro {
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string
    zipcode: string,
    bars: Bar[]
    bills: any[]
}

export interface Bar {
    barid: string,
    name: string,
    street: string,
    city: string,
    zipcode: string,
    checkOutCode: string,
    checkInCode: string,
    active: boolean
}


@Injectable({
    providedIn: 'root'
})
export class GastroService {

    private _gastro$: BehaviorSubject<Gastro> = new BehaviorSubject<Gastro>(null);

    apiName = 'verifyGateway';
    private myInit = { // OPTIONAL

    };

    constructor(
        private authService: AuthenticationService
    ) { }

    public get gastro$(): Observable<Gastro> {
        return this._gastro$.asObservable();
    }

    public set gastro(gastro: Gastro){
        this._gastro$.next(gastro)
    }
    createGatro() {
        console.log(this._gastro$.getValue());
        let gastro = this._gastro$.getValue();
        let body = Object.assign(
            {},
            this.myInit
        );
        body['body'] = gastro;
        API.post(
            this.apiName,
            '/v1/gastro',
            body
        ).then(elem => {
            this._gastro$.next(elem);

        }).catch(elem => {
            console.log(elem);
        });
    }

    getGastro() {
        API.get(
            this.apiName,
            '/v1/gastro/me',
            this.myInit
        ).then(elem => {
            this._gastro$.next(elem);
        }).catch(error => {
            console.log(error);
            this._gastro$.next(<Gastro>{});
        });
    }

    addBar(bar: Bar) {

        let body = Object.assign(
            {},
            this.myInit
        );
        body['body'] = bar;
        console.log(body)
        return API.post(
            this.apiName,
            '/v1/gastro/me/bar',
            body
        )
    }

    removeBar(bar: Bar) {
       return  API.del(
            this.apiName,
            '/v1/gastro/me/bar/' + bar.barid,
            this.myInit
        )
    }
}
