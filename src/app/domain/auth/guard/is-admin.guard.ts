import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationService} from '../authentication.service';

@Injectable({
    providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.role$.pipe(
            map(elem => {

                return elem.includes('admin');
            }));
    }

}
