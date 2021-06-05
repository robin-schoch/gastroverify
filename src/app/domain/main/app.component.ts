import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToolbarService} from './toolbar.service';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../auth/authentication.service';
import {map, tap} from 'rxjs/operators';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {Store} from '@ngrx/store';
import {getAuthRoles} from '../auth/auth.selectors';

interface Language {
  short: string,
  name: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'verify-manager';
  toolbarTitle$: Observable<string>;
  toolbarHidden$: Observable<boolean>;

  opened: boolean;

  private _roles$ = this.store.select(getAuthRoles);
  languages: Language[] = [
    {short: 'de', name: 'Deutsch'},
    {short: 'en', name: 'English'}
  ];
  isAdmin$: Observable<boolean>;

  constructor(
      private toolbarService: ToolbarService,
      private store: Store,
      private changeDetect: ChangeDetectorRef,
      private translate: TranslateService,
      private locationService: GastroService,
      private authService: AuthenticationService
  ) {


    translate.addLangs(this.languages.map(lang => lang.short));


    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');

    // Set Browser Language as Init Language
    //translate.use(translate.getBrowserLang());
    this.isAdmin$ = this._roles$.pipe(
        tap(roles => console.log(roles)),
        map(roles => roles.filter(elem => elem === 'admin')),
        map(roles => roles.length > 0),
    );


    this.isAdmin$.subscribe(elem => console.log('admin = ' + elem));

  }

  setOpened(opened: boolean): void {
    this.opened = opened;
    this.hackForIOSLogout();
  }

  ngOnInit(): void {
    this.toolbarTitle$ = this.toolbarService.toolbarTitle$.asObservable();
    this.toolbarHidden$ = this.toolbarService.toolbarHidden$.asObservable();
  }

  ngAfterViewChecked() {
    this.changeDetect.detectChanges();
  }


  changeLanguage(language: Language) {
    this.translate.use(language.short);

    console.log('changed language');
  }


  hackForIOSLogout() {
    this.authService.signOut();
    this.locationService.clearPartner();
    this.locationService.loaded = false;
  }

}
