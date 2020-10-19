import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Partner} from '../../../model/Partner';
import {AdminService} from '../admin.service';


@Component({
  selector: 'app-admin-partner-detail',
  templateUrl: './admin-partner-detail.component.html',
  styleUrls: ['./admin-partner-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPartnerDetailComponent implements OnInit {

  @Input()
  public partner: Partner;

  constructor(
      private adminService: AdminService
  ) { }

  ngOnInit(): void {

  }

  public addReferral() {
    this.adminService
        .changeReferral(true, this.partner)
        .subscribe(success => this.partner.referral += 1);

  }

  public removeReferral() {
    this.adminService
        .changeReferral(false, this.partner)
        .subscribe(success => this.partner.referral -= 1);
  }

  getCount() {

  }
}
