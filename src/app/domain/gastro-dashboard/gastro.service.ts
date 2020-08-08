import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import API from '@aws-amplify/api';
import {AuthenticationService} from '../auth/authentication.service';

export interface Gastro {
    email: string,
    barName: string,
    address: string,
    city: string,
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
        body: {}
    };

    constructor(
        private authService: AuthenticationService
    ) { }

    public get gastro$(): Observable<Gastro> {
        return this._gastro$.asObservable();
    }

    createGatro(gastro: Gastro) {
        let body = Object.assign(
            {},
            this.myInit
        );
        body.body = gastro;
        API.post(
            this.apiName,
            '/v1/gastro',
            body
        ).then(elem => {
            console.log(elem);
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
        });
    }

    addBar(bar: Bar) {

        let body = Object.assign(
            {},
            this.myInit
        );
        body.body = bar;
        API.post(
            this.apiName,
            '/v1/gastro/me/bar',
            body
        ).then(elem => {
            console.log(elem);
        }).catch(error => {
            console.log(error);
        });
    }

    removeBar(bar: Bar) {
        API.del(
            this.apiName,
            '/v1/gastro/me/bar' + bar.barid,
            this.myInit
        ).then(elem => {
            console.log(elem);
        }).catch(elem => {
            console.log(elem);
        });
    }
}
