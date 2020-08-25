import {Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IAddBarData} from '../../gastro-dashboard/add-bar-dialog/add-bar-dialog.component';
import {IPersonalAddDialogData} from '../../personal/personal-add-dialog/personal-add-dialog.component';
import {Partner} from '../../gastro-dashboard/gastro.service';



export interface IPartnerOverview {
    partner: Partner
}



@Component({
  selector: 'app-partner-overview',
  templateUrl: './partner-overview.component.html',
  styleUrls: ['./partner-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerOverviewComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IPartnerOverview,
      public dialogRef: MatDialogRef<PartnerOverviewComponent>,
  ) { }

  ngOnInit(): void {
  }

}
