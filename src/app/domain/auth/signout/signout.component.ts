import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
