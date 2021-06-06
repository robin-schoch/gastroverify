import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {GastroService} from '../../service/gastro.service';
import {errorLoadingPartner, loadPartner, successLoadingPartner} from './partner.action';
import {of} from 'rxjs';

@Injectable()
export class PartnerEffect {

  loadPartner$ = createEffect((): any =>
      this.actions$.pipe(
          ofType(loadPartner),
          switchMap(a => this.partnerService.loadPartner()),
          map(partner => successLoadingPartner({partner})),
          catchError(error => of(errorLoadingPartner({error})))
      )
  );


  constructor(
      private actions$: Actions,
      private store: Store,
      private partnerService: GastroService
  ) {}

}
