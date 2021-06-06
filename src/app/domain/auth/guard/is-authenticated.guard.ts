import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {tap} from 'rxjs/operators';

import {Store} from '@ngrx/store';
import {selectIsSignedIn} from '../../../store/authentication/authentication.selector';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  private _isSignedIn$ = this.store.select(selectIsSignedIn);

  constructor(
      private router: Router,
      private store: Store
  ) {}

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._isSignedIn$.pipe(
        tap(elem => {if (!elem) this.router.navigate(['home']);}));
  }

}
