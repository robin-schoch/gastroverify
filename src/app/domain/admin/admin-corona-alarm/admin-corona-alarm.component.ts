import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Partner} from '../../../model/Partner';
import {Location} from '../../../model/Location';
import {BehaviorSubject} from 'rxjs';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-admin-corona-alarm',
  templateUrl: './admin-corona-alarm.component.html',
  styleUrls: ['./admin-corona-alarm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
}
