import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {GastroService} from './gastro.service';
import {Location} from '../../model/Location';
import {Partner} from '../../model/Partner';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter, map, skip, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {AddBarDialogComponent, IAddBarData} from './add-bar-dialog/add-bar-dialog.component';
import {Router} from '@angular/router';
import {ConfirmdialogComponent} from '../confirmdialog/confirmdialog.component';
import {SnackbarService} from '../snackbar/snackbar.service';
import {TranslateService} from '@ngx-translate/core';
import {EntryBrowserComponent} from '../entry-browser/entry-browser/entry-browser.component';
import {ChooseQrCodeDialogComponent} from './choose-qr-code-dialog/choose-qr-code-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-gastro-dashboard',
  templateUrl: './gastro-dashboard.component.html',
  styleUrls: ['./gastro-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastroDashboardComponent implements OnInit, OnDestroy {

  public partner$: Observable<Partner>;
  public newPartner$: Observable<boolean>;
  public selectedBar$ = new BehaviorSubject<Location>(null);
  private _subs: Subscription[] = [];
  displayedColumns: string[] = [
    'Name',
    // 'Entries',
   // 'QRCodes',
   // 'Delete',
    'Action'
  ];


  constructor(
      private authenticationService: AuthenticationService,
      private toolbarService: ToolbarService,
      private entryService: EntryService,
      private gastroService: GastroService,
      public dialog: MatDialog,
      private router: Router,
      private snackbar: SnackbarService,
      private translat: TranslateService,
      private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {

    const tsub = this.translat.get('context.dashboard').subscribe(elem => {
      this.toolbarService.toolbarTitle = elem;
    });
    this._subs.push(tsub);

    this.partner$ = this.gastroService.gastro$;
    this.toolbarService.toolbarTitle = 'Übersicht';
    this.newPartner$ = this.gastroService.gastro$.pipe(
        tap(f => console.log(f)),
        skip(1),
        filter(g => !g?.email),
        tap(f => console.log(f)),
        map(g => !!g?.email)
    );
    this.toolbarService.toolbarHidden = false;
    this.gastroService.getPartner().subscribe(
        elem => this.gastroService.gastro = elem,
        error => {
          console.log(error.statusCode);
          if (error.statusCode !== 404) this.gastroService.error = error;
        }
    );
    this.gastroService.error$.subscribe(elem => this.router.navigate([
      'location',
      'personal'
    ]));
    let sub = this.newPartner$.subscribe(elem => {
      this.router.navigate([
        'location',
        'personal'
      ]);
    });
    this._subs.push(sub);
  }

  ngOnDestroy() {
    this._subs.forEach(elem => elem.unsubscribe());
  }


  openAddDialog() {

    let dialogRef = this.dialog.open(
        AddBarDialogComponent,
        {
          autoFocus: false,
          width: '90vw',
          data: <IAddBarData>{
            senderID: this.gastroService.gastro.organisation
          }
        }
    );
  }

  openQRCodeDialog(element: Location) {
    this.dialog.open(
        ChooseQrCodeDialogComponent,
        {
          autoFocus: false,
          width: '300px',
          data: element
        }
    );/*url: `${code}?businessName=${buisnessname}`,
     text: text,
     name: buisnessname*/
  }

  deleteLocation(location: Location) {
    this.gastroService.removeBar(location).subscribe(
        elem => {
          const p = this.gastroService.gastro;
          p.locations = [...p.locations.filter(l => l.locationId !== location.locationId), elem];
          this.gastroService.gastro = Object.assign(
              {},
              p
          );
        },
        error => console.log(error)
    );
  }

  activateLocation(location: Location) {
    this.gastroService.activateLocation(location).subscribe(
        elem => {
          const p = this.gastroService.gastro;
          p.locations = [...p.locations.filter(l => l.locationId !== location.locationId), elem];
          this.gastroService.gastro = Object.assign(
              {},
              p
          );
        },
        error => console.log(error)
    );
  }

  selectBar(row: Location) {
    this._bottomSheet.open(EntryBrowserComponent,
        {
          panelClass: 'my-component-bottom-sheet-no-padding',
          data: row
        });
    /*
     this.dialog.open(
     EntryBrowserComponent,
     {
     autoFocus: false,
     height: '90vh',
     width: '90vw',
     data: row,
     panelClass: 'no-padding-dialog'
     }
     );*/
  }

  openConfirmDialog(location: Location): void {
    const dialogRef = this.dialog.open(
        ConfirmdialogComponent,
        {
          autoFocus: false,
          width: '250px',
          data: {message: 'Standort ' + location.name + ' löschen? Alle gespeicherten Eintritte gehen verloren!'}
        }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLocation(location);
      }

    });
  }

  openConfirmDialogActive(location: Location): void {
    const dialogRef = this.dialog.open(
        ConfirmdialogComponent,
        {
          autoFocus: false,
          width: '250px',
          data: {message: 'Standort ' + location.name + ' wieder aktivieren?'}
        }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activateLocation(location);
      }

    });
  }

}
