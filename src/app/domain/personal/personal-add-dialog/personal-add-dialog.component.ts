import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IAddBarData} from '../../gastro-dashboard/add-bar-dialog/add-bar-dialog.component';
import {GastroService} from '../../gastro-dashboard/gastro.service';
import {Partner} from '../../../model/Partner';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {SnackbarService} from '../../snackbar/snackbar.service';

export interface IPersonalAddDialogData {

}

@Component({
  selector: 'app-personal-add-dialog',
  templateUrl: './personal-add-dialog.component.html',
  styleUrls: ['./personal-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAddDialogComponent implements OnInit, OnDestroy {

  public partner: Partner = <Partner>{};

  public _subs: Subscription[] = [];

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IAddBarData,
      public dialogRef: MatDialogRef<IPersonalAddDialogData>,
      private gastroService: GastroService,
      private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    const sub = this.gastroService.gastro$.pipe(
        filter(elem => !!elem?.email)
    ).subscribe(elem => {
      this.dialogRef.close();
    });
    const sub2 = this.gastroService.error$.subscribe(elem => this.snackbar.error(elem));
    this._subs.push(sub);

  }

  ngOnDestroy() {
    this._subs.forEach(elem => elem.unsubscribe());
  }

  registerNewPartner() {
    this.gastroService.createPartner(this.partner).subscribe(
        elem => this.gastroService.gastro = elem,
        error => this.gastroService.error = error
    );
  }

}

/*
 .then(elem => {
 this._gastro$.next(elem);

 }).catch(elem => {
 this._error$.next(elem);
 console.log(elem);
 });
 */
