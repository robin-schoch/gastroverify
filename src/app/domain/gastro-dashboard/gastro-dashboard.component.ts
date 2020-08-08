import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {Bar, Gastro, GastroService} from './gastro.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {AddBarDialogComponent, IAddBarData} from './add-bar-dialog/add-bar-dialog.component';

@Component({
    selector: 'app-gastro-dashboard',
    templateUrl: './gastro-dashboard.component.html',
    styleUrls: ['./gastro-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastroDashboardComponent implements OnInit {

    public gastro$: Observable<Gastro>;
    public newGastro$: Observable<boolean>;
    public selectedBar$ = new BehaviorSubject<Bar>(null);
    displayedColumns: string[] = [
        'BarID',
        'Name',
        'CheckOutCode',
        'CheckInCode',
        'Delete'
    ];


    constructor(
        private authenticationService: AuthenticationService,
        private toolbarService: ToolbarService,
        private entryService: EntryService,
        private gastroService: GastroService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.gastro$ = this.gastroService.gastro$;
        this.newGastro$ = this.gastroService.gastro$.pipe(map(g => !!g.email));
        this.toolbarService.toolbarHidden = false;
        this.gastroService.getGastro();
        //  this.authenticationService.signOut()
    }

    register() {
        this.gastroService.createGatro();
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

    deleteBar(bar: Bar) {
        this.gastroService.removeBar(bar).then(elem => this.gastroService.gastro = elem).catch(error => console.log(error));

    }

    selectBar(row: Bar) {
        this.selectedBar$.next(row);
    }
}
