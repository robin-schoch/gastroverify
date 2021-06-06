import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthenticationService} from '../../domain/auth/authentication.service';
import {
  clearAuthStatus,
  confirmAuthStatus,
  noInitialUser,
  rehydrateCurrentUser,
  signOut, successLogin
} from './authentication.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {of} from 'rxjs';

@Injectable()
export class AuthenticationEffect {

  signOut$ = createEffect((): any =>
      this.actions$.pipe(
          ofType(signOut),
          switchMap(action => this.authenticationService.signOutObservable()),
          tap( logout => this.router.navigate(['/'])),
          map( loguot => clearAuthStatus())
      )
  );

  setInitialUser$ = createEffect((): any =>
      this.actions$.pipe(
          ofType(rehydrateCurrentUser, successLogin),
          switchMap(this.authenticationService.getCurrentUserFromAws),
          map(user => confirmAuthStatus({
            username: user.getUsername(),
            roles: user?.getSignInUserSession().getIdToken().decodePayload()['cognito:groups'] ?? []
          })),
          catchError(err => of(noInitialUser()))
      )
  )

  constructor(
      private actions$: Actions,
      private authenticationService: AuthenticationService,
      private router: Router
  ) {}

}
