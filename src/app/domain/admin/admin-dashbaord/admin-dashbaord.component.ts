import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AdminService} from '../admin.service';
import {Observable} from 'rxjs';
import {Page} from '../../entry-browser/entry.service';

import {IPartnerOverview, PartnerOverviewComponent} from '../partner-overview/partner-overview.component';
import {MatDialog} from '@angular/material/dialog';
import {filter, map, tap} from 'rxjs/operators';
import {Partner} from '../../../model/Partner';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-admin-dashbaord',
  templateUrl: './admin-dashbaord.component.html',
  styleUrls: ['./admin-dashbaord.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashbaordComponent implements OnInit {

  public partners$: Observable<Page<Partner>>;

  private _hiddenPartner$: Observable<Page<Partner>>;
  private _partner$: Observable<Page<Partner>>;

  private isHidden: boolean = true;


  displayedColumns = [
    'detail',
    'email',
    'firstName',
    'lastName',
    'address',
    'city',
    'zip',
    'hide'
  ];

  /*
   let part = partners;
   part.Data = partners.Data.filter(elem => elem.hidden || elem.hidden === undefined);
   return part;
   */

  constructor(
      private adminService: AdminService,
      private dialog: MatDialog,
      private _bottomSheet: MatBottomSheet
  ) {

  }

  ngOnInit(): void {
    this.loadPartners();
    this._hiddenPartner$ = this.adminService.partners$.pipe(
        filter(elem => !!elem),
        tap(elem => console.log(elem)),
        map(partners => Object.assign(
            {},
            partners,
            {Data: partners.Data.filter(elem => !Boolean(elem.isHidden) || elem.isHidden === undefined)}
        ))
    );
    this._partner$ = this.adminService.partners$.pipe(
        filter(elem => !!elem),
        tap(elem => console.log(elem)),
        map(partners => Object.assign(
            {},
            partners,
            {Data: partners.Data.filter(elem => Boolean(elem.isHidden) || !elem.isHidden === undefined)}
        ))
    );

    this.partners$ = this._hiddenPartner$;

  }

  private loadPartners() {
    this.adminService.partners = null;
    this.adminService.loadPartners().subscribe(elem => this.adminService.mergePartners(elem));
  }

  public toggleHidden() {
    this.partners$ = this.isHidden ? this._partner$ : this._hiddenPartner$;
    this.isHidden = !this.isHidden;

  }

  onPageEvent(page: Page<Partner>) {
    this.adminService.loadPartners(page).subscribe(elem => this.adminService.mergePartners(elem));
  }

  openPartnerDetail(parnter: Partner) {
    const bottomSheetRef = this._bottomSheet.open(PartnerOverviewComponent,
        {
          panelClass: 'my-component-bottom-sheet-no-padding',
          data: <IPartnerOverview>{partner: parnter}
        });

    /*
     const dialogRef = this.dialog.open(
     PartnerOverviewComponent,
     {
     panelClass: 'no-padding-dialog',
     height: '95vh',
     width: '98vw',
     data: <IPartnerOverview>{partner: parnter}
     }
     );*/
  }

  public hidePartner(partner: Partner, hide = true) {
    this.adminService.hideUser(partner.email, !hide).subscribe(elem => {
      this.loadPartners();
    });
  }

  toBool(isHidden: string | boolean) {
    return Boolean(isHidden);

  }
}
