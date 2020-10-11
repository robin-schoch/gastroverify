import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Partner} from '../../../model/Partner';
import {Location} from '../../../model/Location';
import {BehaviorSubject} from 'rxjs';
import {AdminService} from '../admin.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
// tslint:disable-next-line:no-duplicate-imports
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-admin-corona-alarm',
  templateUrl: './admin-corona-alarm.component.html',
  styleUrls: ['./admin-corona-alarm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

  ]

})
export class AdminCoronaAlarmComponent implements OnInit {


  @Input()
  public partner: Partner;

  public location: Location;

  public locations: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>(null);

  public time: string;

  public fistName: string;

  public lastName: string;

  public phoneNumber: string;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.loadLocations(this.partner.email).subscribe(locations => {
      this.locations.next(locations.Data);
    });
  }


  selectLocation(location: Location) {

    if (location != this.location) {
      this.location = location;
    }
  }

  getSubjects() {
    this.adminService.getQuarantineList(
        this.partner.email,
        this.location.locationId,
        this.time,
        this.fistName,
        this.lastName,
        this.phoneNumber
    ).subscribe(elem => console.log(elem));
  }

  dateChanged(change: string, $event: MatDatepickerInputEvent<any, any>) {
    this.time = $event.value.toISOString(true);
  }
}
