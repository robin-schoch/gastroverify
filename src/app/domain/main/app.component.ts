import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {GastroService} from '../../service/gastro.service';
import {Store} from '@ngrx/store';
import {selectAuthRoles, selectIsAdmin} from '../../store/authentication/authentication.selector';
import {rehydrateCurrentUser, signOut} from '../../store/authentication/authentication.action';
import {rehydrateLanguages, setLanguage} from '../../store/context/context.action';
import {selectLanguages, selectToolbarHidden, selectToolbarTitle} from '../../store/context/context.selector';
import {Language} from '../../store/context/context.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'verify-manager';
  toolbarTitle$: Observable<string> = this.store.select(selectToolbarTitle);
  toolbarHidden$: Observable<boolean> =this.store.select(selectToolbarHidden);

  opened: boolean;


  isAdmin$: Observable<boolean> = this.store.select(selectIsAdmin);
  languages$: Observable<Language[]> = this.store.select(selectLanguages);

  constructor(
      private store: Store,
      private changeDetect: ChangeDetectorRef,
      private locationService: GastroService,
  ) {

    this.store.dispatch(rehydrateLanguages())
  }

  setOpened(opened: boolean): void {
    this.opened = opened;
    this.hackForIOSLogout();
  }

  ngOnInit(): void {
    this.store.dispatch(rehydrateCurrentUser())
  }

  ngAfterViewChecked() {
    this.changeDetect.detectChanges();
  }


  changeLanguage(language: Language) {
    this.store.dispatch(setLanguage({short: language.short}))
  }


  hackForIOSLogout() {
    this.store.dispatch(signOut());
    this.locationService.clearPartner();
    this.locationService.loaded = false;
  }

}
