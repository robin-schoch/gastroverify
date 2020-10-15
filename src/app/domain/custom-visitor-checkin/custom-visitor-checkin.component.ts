import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CheckIn} from '../../model/CheckIn';

@Component({
  selector: 'app-custom-visitor-checkin',
  templateUrl: './custom-visitor-checkin.component.html',
  styleUrls: ['./custom-visitor-checkin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomVisitorCheckinComponent implements OnInit {

  constructor() { }

  public checkIn: Partial<CheckIn> = {};

  ngOnInit(): void {
  }

  checkInUser() {
    console.log(this.checkIn)
  }
}
