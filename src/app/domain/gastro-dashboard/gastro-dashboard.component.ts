import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {GastroService, Location, Partner} from './gastro.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter, map, skip, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {AddBarDialogComponent, IAddBarData} from './add-bar-dialog/add-bar-dialog.component';
import {
    IQRCodeGeneratorData,
    QrCodeGeneratorDialogComponent
} from './qr-code-generator-dialog/qr-code-generator-dialog.component';
import {Router} from '@angular/router';
import {ConfirmdialogComponent} from '../confirmdialog/confirmdialog.component';
import {SnackbarService} from '../snackbar/snackbar.service';

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
        'BarID',
        'Name',
        'CheckOutCode',
        'CheckInCode',
        'CheckIn',
        'CheckOut',
        'Delete'
    ];


    constructor(
        private authenticationService: AuthenticationService,
        private toolbarService: ToolbarService,
        private entryService: EntryService,
        private gastroService: GastroService,
        public dialog: MatDialog,
        private router: Router,
        private snackbar: SnackbarService
    ) { }

    ngOnInit() {

        this.partner$ = this.gastroService.gastro$;
        this.toolbarService.toolbarTitle = 'Dashboard';
        this.newPartner$ = this.gastroService.gastro$.pipe(
            skip(1),
            filter(g => !g?.email),
            tap(f => console.log(f)),
            map(g => !!g?.email)
        );
        this.toolbarService.toolbarHidden = false;
        this.gastroService.getGastro();
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
                height: '90vh',
                width: '90vw',
                data: <IAddBarData>{}
            }
        );
    }

    openQRCodeDialog(code: string, text: string, buisnessname: string) {
        let dialogRef = this.dialog.open(
            QrCodeGeneratorDialogComponent,
            {
                height: '90vh',
                width: '90vw',
                data: <IQRCodeGeneratorData>{
                    url: `${code}?businessName=${buisnessname}`,
                    text: text
                }
            }
        );
    }

    deleteLocation(location: Location) {
        this.gastroService.removeBar(location).then(elem => this.gastroService.gastro = elem).catch(error => console.log(error));

    }

    selectBar(row: Location) {
        this.selectedBar$.next(row);
    }

    openConfirmDialog(location: Location): void {
        const dialogRef = this.dialog.open(
            ConfirmdialogComponent,
            {
                width: '250px',
                data: {message: 'Standort ' + location.name + ' löschen?'}
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteLocation(location);
            }

        });
    }

}
