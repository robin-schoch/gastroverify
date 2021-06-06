import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {EntryService} from '../entry-browser/entry.service';
import {GastroService} from '../../service/gastro.service';
import {Partner} from '../../model/Partner';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {IPersonalAddDialogData, PersonalAddDialogComponent} from './personal-add-dialog/personal-add-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Store} from '@ngrx/store';
import {setToolbarHidden, setToolbarTitle} from '../../store/context/context.action';
import {selectPartner} from '../../store/partner/partner.selector';

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
      private entryService: EntryService,
      private gastroService: GastroService,
      public dialog: MatDialog,
      private _bottomSheet: MatBottomSheet,
      private store: Store
  ) {
    this.partner$ = this.store.select(selectPartner);
    this.newPartner$ = this.gastroService.gastro$.pipe(
        map(g => !g?.email)
    );
  }

  ngOnInit() {

    this.store.dispatch(setToolbarTitle({title: "elem"}))
    this.store.dispatch(setToolbarHidden({hidden: false}))

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
