import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Partner} from '../../../model/Partner';
import {AdminService} from '../admin.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';


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
      // @Inject(MAT_DIALOG_DATA) public data: IPartnerOverview,
      // public dialogRef: MatDialogRef<PartnerOverviewComponent>,
      private _bottomSheetRef: MatBottomSheetRef<PartnerOverviewComponent>,
      @Inject(MAT_BOTTOM_SHEET_DATA) public data: IPartnerOverview,
      private adminService: AdminService
  ) {

  }

  ngOnInit(): void {
    this.adminService.loadLocations(this.data.partner.email).subscribe(locations => {
      this.data.partner.locations = locations.Data;
    });
  }

  public close(): void {
    this._bottomSheetRef.dismiss();
  }

}
