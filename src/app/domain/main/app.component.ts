import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToolbarService} from './toolbar.service';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../auth/authentication.service';
import {map} from 'rxjs/operators';

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
    username$: Observable<string>;

    opened: boolean;

    languages: Language[] = [
        {short: 'de', name: "Deutsch"},
        {short:  'en', name: "English"}
    ];

    constructor(
        private toolbarService: ToolbarService,
        private changeDetect: ChangeDetectorRef,
        private translate: TranslateService,
        private authService: AuthenticationService
    ) {

        this.username$ = this.authService.activeUser$.pipe(map(user => user.getSignInUserSession().getIdToken().decodePayload().email));
        translate.addLangs(this.languages.map(lang => lang.short));


        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('de');

        // Set Browser Language as Init Language
        translate.use(translate.getBrowserLang());

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

        console.log("changed language")
    }
}
