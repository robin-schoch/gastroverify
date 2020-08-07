import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {decode} from 'punycode';

@Injectable({
    providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.isAuthenticated;
    }

}
