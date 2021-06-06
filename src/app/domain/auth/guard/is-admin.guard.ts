import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationService} from '../authentication.service';
import {Store} from '@ngrx/store';
import {selectIsAdmin} from '../../../store/authentication/authentication.selector';

@Injectable({
    providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private store: Store
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.store.select(selectIsAdmin)
    }

}
