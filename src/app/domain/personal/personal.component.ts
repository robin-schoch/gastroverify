import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {Partner} from '../../model/Partner';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {IPersonalAddDialogData, PersonalAddDialogComponent} from './personal-add-dialog/personal-add-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalComponent implements OnInit, OnDestroy {

  public partner$: Observable<Partner>;
  public newPartner$: Observable<boolean>;
  private _dialogRef: MatDialogRef<PersonalAddDialogComponent>;

  private _subs: Subscription[] = [];

  constructor(
      private toolbarService: ToolbarService,
      private entryService: EntryService,
      private gastroService: GastroService,
      public dialog: MatDialog,
      private translet: TranslateService,
      private _bottomSheet: MatBottomSheet
  ) {
    this.partner$ = this.gastroService.gastro$;
    this.newPartner$ = this.gastroService.gastro$.pipe(
        map(g => !g?.email)
    );
  }

  ngOnInit() {

    const tsub = this.translet.get('personal.toolbar').subscribe(elem => {
      this.toolbarService.toolbarTitle = elem;
    });
    this._subs.push(tsub);

    this.toolbarService.toolbarHidden = false;
    this.gastroService.getPartner().subscribe(
        elem => this.gastroService.gastro = elem,
        error => this.gastroService.error = error
    );
    const sub = this.newPartner$.pipe(
        tap(elem => console.log('new? ' + elem)),
        filter(t => t)
    ).subscribe(elem => this.openAddDialog());
    this._subs.push(sub);

  }

  ngOnDestroy() {
    this._subs.forEach(elem => elem.unsubscribe());
  }


  updateBillingAddress() {
    // this.gastroService.

    this.gastroService.updatePartner(this.gastroService.gastro)
        .subscribe(elem => this.gastroService.gastro = elem);

  }


  openAddDialog() {

    if (!this._dialogRef) {
      this._dialogRef = this.dialog.open(
          PersonalAddDialogComponent,
          {
            disableClose: true,
            height: '90vh',
            width: '90vw',
            data: <IPersonalAddDialogData>{}
          }
      );
    }

  }
}
