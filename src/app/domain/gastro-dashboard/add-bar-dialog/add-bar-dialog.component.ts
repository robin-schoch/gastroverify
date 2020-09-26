import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GastroService, Location} from '../gastro.service';
import {SnackbarService} from '../../snackbar/snackbar.service';
import {BehaviorSubject} from 'rxjs';

export interface IAddBarData {

}

@Component({
  selector: 'app-add-bar-dialog',
  templateUrl: './add-bar-dialog.component.html',
  styleUrls: ['./add-bar-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBarDialogComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IAddBarData,
      public dialogRef: MatDialogRef<AddBarDialogComponent>,
      private gastroService: GastroService,
      private snackBar: SnackbarService
  ) { }

  public newLocation = <Location>{};


  public options = [
    'Tisch',
    'Raum',
    'Turnhalle',
    'Kinosaal',
    'Sektor'
  ];
  public filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.options);

  public reg = new RegExp('^[A-z0-9]*');
  enablePremium: boolean = false;

  ngOnInit() {
  }

  addBar() {
    this.gastroService.addBar(this.newLocation).subscribe(
        elem => {
          const p = this.gastroService.gastro;
          console.log(p);
          p.locations = [...p.locations, elem];
          this.gastroService.gastro = Object.assign(
              {},
              p
          );
          this.dialogRef.close();
        },
        error => {
          this.snackBar.error(error);
          console.log(error);
        }
    );
  }

  filterOptions($event: string) {
    console.log($event);
    this.filteredOptions.next([...this.options.filter(opt => opt.startsWith($event))]);
  }
}
