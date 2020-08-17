import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './domain/main/app.component';
import {GastroDashboardComponent} from './domain/gastro-dashboard/gastro-dashboard.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LandingComponent} from './domain/landing/landing.component';
import {SignupComponent} from './domain/auth/signup/signup.component';
import {AuthComponent} from './domain/auth/auth.component';
import {SigninComponent} from './domain/auth/signin/signin.component';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {SignOutDirective} from './domain/auth/sign-out.directive';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {AddBarDialogComponent} from './domain/gastro-dashboard/add-bar-dialog/add-bar-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {EntryBrowserComponent} from './domain/entry-browser/entry-browser/entry-browser.component';
import {MatListModule} from '@angular/material/list';
import {QrCodeGeneratorDialogComponent} from './domain/gastro-dashboard/qr-code-generator-dialog/qr-code-generator-dialog.component';
import {AnQrcodeModule} from 'an-qrcode';
import {GtcComponent} from './domain/gtc/gtc.component';
import {PersonalComponent} from './domain/personal/personal.component';
import {DatePipe} from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';

Amplify.configure(awsconfig);

@NgModule({
    declarations: [
        AppComponent,
        GastroDashboardComponent,
        LandingComponent,
        SignupComponent,
        AuthComponent,
        SigninComponent,
        SignOutDirective,
        AddBarDialogComponent,
        EntryBrowserComponent,
        QrCodeGeneratorDialogComponent,
        GtcComponent,
        PersonalComponent
    ],
    imports: [
        BrowserModule,
        FlexLayoutModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatCardModule,
        MatTabsModule,
        MatStepperModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatDialogModule,
        MatListModule,
        AnQrcodeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AmplifyUIAngularModule,
    ],
    entryComponents: [AddBarDialogComponent],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule {
}


export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(
        http,
        './assets/i18n/',
        '.json'
    );
}
