import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Partner} from '../../../model/Partner';
import {AdminService} from '../admin.service';


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
        private adminService: AdminService
    ) { }

    ngOnInit(): void {
        this.adminService.loadLocations(this.data.partner.email).subscribe(locations => {
            this.data.partner.locations = locations.Data;
        });
    }

}
