import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {GastroService} from '../../../service/gastro.service';
import {Location} from '../../../model/Location';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface IUpdateLocationData {
  location: Location
}

@Component({
  selector: 'app-update-location-dialog',
  templateUrl: './update-location-dialog.component.html',
  styleUrls: ['./update-location-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateLocationDialogComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IUpdateLocationData,
      public dialogRef: MatDialogRef<UpdateLocationDialogComponent>,
      private locationService: GastroService
  ) { }


  public reg = new RegExp('^[A-z0-9]*');
  enablePremium: boolean = false;

  ngOnInit() {
  }

  updateLocation() {
    /*
     console.log(this.newLocation);
     this.locationService.addBar(this.newLocation).then(elem => {
     this.gastroService.gastro = elem;
     this.dialogRef.close();
     }).catch(elem => {
     this.snackBar.error(elem);
     console.log(elem);

     });
     */
  }
}
