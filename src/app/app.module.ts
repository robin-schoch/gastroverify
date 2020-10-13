import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatNativeDateModule} from '@angular/material/core';
import {MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
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
import {MatMenuModule} from '@angular/material/menu';
import {PersonalAddDialogComponent} from './domain/personal/personal-add-dialog/personal-add-dialog.component';
import {ConfirmdialogComponent} from './domain/confirmdialog/confirmdialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoginDialogComponent} from './domain/auth/login-dialog/login-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReportComponent} from './domain/report/report.component';
import {AdminDashbaordComponent} from './domain/admin/admin-dashbaord/admin-dashbaord.component';
import {AdminReportComponent} from './domain/admin/admin-report/admin-report.component';
import {PartnerOverviewComponent} from './domain/admin/partner-overview/partner-overview.component';
import {ChooseQrCodeDialogComponent} from './domain/gastro-dashboard/choose-qr-code-dialog/choose-qr-code-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SpinnerComponent} from './domain/spinner/spinner.component';
import {UpdateLocationDialogComponent} from './domain/gastro-dashboard/update-location-dialog/update-location-dialog.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {AdminBillComponent} from './domain/admin/admin-bill/admin-bill.component';
import {BillComponent} from './domain/bill/bill.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LandingTileComponent} from './domain/landing/landing-tile/landing-tile.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {AdminPartnerDetailComponent} from './domain/admin/admin-partner-detail/admin-partner-detail.component';
import {EntryCheckTableComponent} from './components/entry-check-table/entry-check-table.component';
import {EntryCheckTableToolbarDirective} from './components/entry-check-table/entry-check-table-toolbar.directive';
import {AdminCoronaAlarmComponent} from './domain/admin/admin-corona-alarm/admin-corona-alarm.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatRadioModule} from '@angular/material/radio';
import {AllgemeineGeschaetsbedienungenComponent} from './domain/personal/allgemeine-geschaetsbedienungen/allgemeine-geschaetsbedienungen.component';

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
    PersonalComponent,
    PersonalAddDialogComponent,
    ConfirmdialogComponent,
    LoginDialogComponent,
    ReportComponent,
    AdminDashbaordComponent,
    AdminReportComponent,
    PartnerOverviewComponent,
    LoginDialogComponent,
    ChooseQrCodeDialogComponent,
    SpinnerComponent,
    UpdateLocationDialogComponent,
    AdminBillComponent,
    BillComponent,
    LandingTileComponent,
    AdminPartnerDetailComponent,
    EntryCheckTableComponent,
    EntryCheckTableToolbarDirective,
    AdminCoronaAlarmComponent,
    AllgemeineGeschaetsbedienungenComponent,

  ],
  imports: [
    MatBottomSheetModule,
    MatMomentDateModule,
    MatNativeDateModule,
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
    MatCheckboxModule,
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
    MatMenuModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    ClipboardModule,
    MatDatepickerModule,
    MatRadioModule
  ],
  entryComponents: [AddBarDialogComponent],
  providers: [DatePipe, {provide: MatBottomSheetRef, useValue: {}}],
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
