import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {rehydrateLanguages, setLanguage} from './context.action';
import {map, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {LocalstorageService} from '../../service/localstorage.service';
import {Store} from '@ngrx/store';
import {selectLanguages} from './context.selector';

@Injectable()
export class ContextEffect {

  changeLanguage$ = createEffect((): any =>
      this.actions$.pipe(
          ofType(setLanguage),
          tap(action => this.translate.use(action.short)),
          tap(action => this.localstorageService.save('language', action.short)),
      ), {dispatch: false}
  );


  rehydrateLanguages$ = createEffect(() =>
      this.actions$.pipe(
          ofType(rehydrateLanguages),
          concatLatestFrom(a => this.store.select(selectLanguages)),
          tap(([action, languages]) => this.translate.addLangs(languages.map(lang => lang.short))),
          map(a => setLanguage({short: this.localstorageService.get<string>('language') ?? 'de'})),
      ));

  constructor(
      private actions$: Actions,
      private translate: TranslateService,
      private localstorageService: LocalstorageService,
      private store: Store
  ) {}

}
